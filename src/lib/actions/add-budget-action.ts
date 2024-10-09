"use server";
import { prismaDb } from "../db/prisma";
import { revalidatePath } from "next/cache";

import { addBudgetSchema } from "../validaton";
import * as z from "zod";
import { auth } from "@/auth";

export async function addBudgetAction({
  values,
}: {
  values: z.infer<typeof addBudgetSchema>;
}) {
  const session = await auth();
  if (!session) return { message: "User not found" };

  //validate values
  const validationResult = addBudgetSchema.safeParse(values);
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
          balance: true,
        },
      });

      if (!findUser) {
        return { message: "User not found" };
      }

      // prevent user create same category budget
      const budget = await prisma.budget.findFirst({
        where: {
          userId: findUser.id,
          category: validationResult.data.category,
        },
      });

      if (budget) {
        return { message: "Budget already exists" };
      }

      //check if

      // create budget
      await prisma.budget.create({
        data: {
          category: validationResult.data.category,
          maximum: parseFloat(validationResult.data.maximum),
          theme: validationResult.data.theme,
          userId: findUser.id,
        },
      });

      revalidatePath("/dashboard/budgets");
      return { message: "Budget added successfully" };
    });
  } catch (error) {
    return { message: "Failed to add budget" };
  }
}

//delete single budget
export async function deleteBudgetAction({ id }: { id: string }) {
  const session = await auth();
  if (!session) return { message: "User not found" };

  try {
    // find user and if user has permission to delete budget
    const findUser = await prismaDb.user.findUnique({
      where: {
        email: session?.user.email,
      },
    });

    if (!findUser) {
      return { message: "User not found" };
    }

    const budget = await prismaDb.budget.findUnique({
      where: {
        id,
      },
    });

    if (!budget) {
      return { message: "Budget not found" };
    }

    if (budget.userId !== findUser.id) {
      return { message: "You don't have permission to delete this budget" };
    }

    await prismaDb.budget.delete({
      where: {
        id,
      },
    });
    revalidatePath("/dashboard/budgets");
  } catch (error) {
    return { message: "Failed to delete budget" };
  }
}

// edit single budget
export async function editBudgetAction({
  values,
  budgetId,
}: {
  budgetId: string;
  values: z.infer<typeof addBudgetSchema>;
}) {
  const session = await auth();
  if (!session) return { message: "User not found" };

  //validate values
  const validationResult = addBudgetSchema.safeParse(values);
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
          budgets: true,
        },
      });

      if (!findUser) {
        return { message: "User not found" };
      }

      const budget = await prisma.budget.findUnique({
        where: {
          id: budgetId,
        },
      });

      if (!budget) {
        return { message: "Budget not found" };
      }

      if (budget.userId !== findUser.id) {
        return { message: "You don't have permission to edit this budget" };
      }

      await prisma.budget.update({
        where: {
          id: budgetId,
        },
        data: {
          category: validationResult.data.category,
          maximum: parseFloat(validationResult.data.maximum),
          theme: validationResult.data.theme,
        },
      });

      revalidatePath("/dashboard/budgets");
      return { message: "Budget updated successfully" };
    });
  } catch (error) {
    return { message: "Failed to edit budget" };
  }
}
