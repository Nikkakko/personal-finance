"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../db/prisma";
import { addBalanceSchema } from "../validaton";
import * as z from "zod";

export async function updateBalanceAction({
  id,
  email,
  values,
}: {
  id: string;
  email: string;
  values: z.infer<typeof addBalanceSchema>;
}) {
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (!findUser) {
      return { message: "User not found" };
    }

    await prisma.balance.upsert({
      where: {
        id,
      },
      update: {
        current: parseFloat(values.current),
        income: parseFloat(values.income),
      },
      create: {
        userId: findUser.id,
        current: parseFloat(values.current),
        income: parseFloat(values.income),
      },
    });

    revalidatePath("/dashboard");

    return { message: "Balance upserted successfully" };
  } catch (error) {
    console.error(error);
    return { message: "An error occurred while upserting the balance" };
  }
}
