"use server";

import { prismaDb } from "../db/prisma";
import { revalidatePath } from "next/cache";
import { addRecurringBillSchema } from "../validaton";
import * as z from "zod";
import { auth } from "@/auth";

export async function addRecurringBillAction({
  values,
}: {
  values: z.infer<typeof addRecurringBillSchema>;
}) {
  const session = await auth();
  if (!session)
    return {
      message: "User not found",
      title: "Error",
    };

  //validate values
  const validationResult = addRecurringBillSchema.safeParse(values);
  if (!validationResult.success) {
    return { message: validationResult.error.errors[0] };
  }

  try {
    return await prismaDb.$transaction(async prisma => {
      const findUser = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },
        include: {
          recurringBills: true,
        },
      });

      if (!findUser) {
        return {
          message: "User not found",
          title: "Error",
        };
      }

      // prevent user create same recurring bill
      const recurringBill = await prisma.recurringBill.findFirst({
        where: {
          userId: findUser.id,
          title: validationResult.data.title,
        },
      });

      if (recurringBill) {
        return {
          message: "Recurring bill already exists",
          title: "Error",
        };
      }

      // create recurring bill
      await prisma.recurringBill.create({
        data: {
          title: validationResult.data.title,
          amount: parseFloat(validationResult.data.amount),
          description: validationResult.data.description,
          category: validationResult.data.category,
          dueDate: validationResult.data.dueDate,
          userId: findUser.id,
          frequency: validationResult.data.frequency,
          isPaid: validationResult.data.isPaid,
        },
      });

      return {
        message: "Recurring bill added successfully",
        title: "Success",
      };
    });
  } catch (error) {
    return {
      message: "Failed to add recurring bill",
      title: "Error",
    };
  }
}
