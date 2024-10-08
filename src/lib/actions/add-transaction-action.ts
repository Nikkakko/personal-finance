"use server";

import { revalidatePath } from "next/cache";
import { prismaDb } from "../db/prisma";
import { addTransactionSchema } from "../validaton";
import * as z from "zod";
import { auth } from "@/auth";

export async function addTransactionAction({
  values,
}: {
  values: z.infer<typeof addTransactionSchema>;
}) {
  const session = await auth();
  if (!session) return { message: "User not found" };

  try {
    return await prismaDb.$transaction(async prisma => {
      const findUser = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },

        include: {
          balance: true,
          budgets: true,
        },
      });

      if (!findUser) {
        return { message: "User not found" };
      }

      const budget = findUser.budgets.find(
        budget => budget.category === values.category
      );

      if (budget && parseFloat(values.amount) > budget.maximum) {
        return { message: "Transaction amount exceeds budget maximum" };
      }

      await prisma.transaction.create({
        data: {
          amount: parseFloat(values.amount),
          description: values.description,
          date: values.createdAt || new Date(),
          category: values.category,
          type: values.type,
          recurring: values.isRecurring,
          user: {
            connect: {
              email: session?.user.email,
            },
          },
        },
      });

      const userBalance = await prisma.balance.findFirst({
        where: {
          userId: findUser.id,
        },
      });

      if (!userBalance) {
        const calculateBalance = await prisma.transaction.findMany({
          where: {
            userId: findUser.id,
          },
          select: {
            amount: true,
            type: true,
          },
        });

        let balance = 0;

        calculateBalance.forEach(transaction => {
          if (transaction.type === "INCOME") {
            balance += transaction.amount;
          } else {
            balance -= transaction.amount;
          }
        });

        const income = calculateBalance
          .filter(transaction => transaction.type === "INCOME")
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        const expenses = calculateBalance
          .filter(transaction => transaction.type === "EXPENSE")
          .reduce((acc, transaction) => acc + transaction.amount, 0);

        await prisma.balance.create({
          data: {
            userId: findUser.id,

            current: balance,
            expenses: expenses,
            income: income,
          },
        });
      } else {
        await prisma.balance.update({
          where: {
            id: userBalance.id,
          },
          data: {
            current: userBalance.current + parseFloat(values.amount),
            expenses: userBalance.expenses + parseFloat(values.amount),
            income: userBalance.income + parseFloat(values.amount),
          },
        });
      }

      revalidatePath("/dashboard");
      return { message: "Transaction added successfully" };
    });
  } catch (error) {
    console.error(error);
    return { message: "An error occurred while upserting the balance" };
  }
}
