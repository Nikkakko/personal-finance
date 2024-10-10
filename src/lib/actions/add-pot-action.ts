"use server";

import { prismaDb } from "../db/prisma";
import { revalidatePath } from "next/cache";
import { addPotSchema, potActionSchema } from "../validaton";
import * as z from "zod";
import { auth } from "@/auth";

export async function addPotAction({
  values,
}: {
  values: z.infer<typeof addPotSchema>;
}) {
  const session = await auth();
  if (!session) return { message: "User not found" };

  //validate values
  const validationResult = addPotSchema.safeParse(values);
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
          pots: true,
        },
      });

      if (!findUser) {
        return { message: "User not found" };
      }

      // prevent user create same pot
      const pot = await prisma.pot.findFirst({
        where: {
          userId: findUser.id,
          name: validationResult.data.name,
        },
      });

      if (pot) {
        return { message: "Pot already exists" };
      }

      // create pot
      await prisma.pot.create({
        data: {
          name: validationResult.data.name,
          target: parseFloat(validationResult.data.target),
          theme: validationResult.data.theme,
          userId: findUser.id,
          total: 0,
        },
      });

      revalidatePath("/dashboard/pots");
      return { message: "Pot added successfully" };
    });
  } catch (error) {
    return { message: "Failed to add pot" };
  }
}

export async function potAction({
  values,
  action,
  potId,
}: {
  values: z.infer<typeof potActionSchema>;
  action: "add-money" | "withdraw-money";
  potId: string | undefined;
}) {
  const session = await auth();
  if (!session)
    return {
      message: "User not found",
      title: "Error",
    };

  //validate values
  const validationResult = potActionSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      message: validationResult.error.errors[0],
      title: "Error",
    };
  }

  try {
    return await prismaDb.$transaction(async prisma => {
      const findUser = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },
        include: {
          pots: true,
        },
      });

      if (!findUser) {
        return {
          message: "User not found",
          title: "Error",
        };
      }

      const pot = await prisma.pot.findUnique({
        where: {
          id: potId,
          userId: findUser.id,
        },
      });

      if (!pot) {
        return {
          message: "Pot not found",
          title: "Error",
        };
      }

      if (action === "add-money") {
        await prisma.pot.update({
          where: {
            id: pot.id,
          },
          data: {
            total: pot.total + parseFloat(validationResult.data.amount),
          },
        });
      } else {
        await prisma.pot.update({
          where: {
            id: pot.id,
          },
          data: {
            total: pot.total - parseFloat(validationResult.data.amount),
          },
        });
      }

      revalidatePath("/dashboard/pots");
      return {
        title: "Success",
        message: "Pot updated successfully",
      };
    });
  } catch (error) {
    return { message: "Failed to update pot" };
  }
}

export async function deletePotAction({ potId }: { potId: string }) {
  const session = await auth();
  if (!session)
    return {
      message: "User not found",
      title: "Error",
    };

  try {
    return await prismaDb.$transaction(async prisma => {
      const findUser = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },
        include: {
          pots: true,
        },
      });

      if (!findUser) {
        return {
          message: "User not found",
          title: "Error",
        };
      }

      const pot = await prisma.pot.findUnique({
        where: {
          id: potId,
          userId: findUser.id,
        },
      });

      if (!pot) {
        return {
          message: "Pot not found",
          title: "Error",
        };
      }

      await prisma.pot.delete({
        where: {
          id: pot.id,
        },
      });

      revalidatePath("/dashboard/pots");
      return {
        title: "Success",
        message: "Pot deleted successfully",
      };
    });
  } catch (error) {
    return { message: "Failed to delete pot" };
  }
}

export async function updatePotAction({
  values,
  potId,
}: {
  values: z.infer<typeof addPotSchema>;
  potId: string;
}) {
  const session = await auth();
  if (!session)
    return {
      message: "User not found",
      title: "Error",
    };

  //validate values
  const validationResult = addPotSchema.safeParse(values);
  if (!validationResult.success) {
    return {
      message: validationResult.error.errors[0],
      title: "Error",
    };
  }

  try {
    return await prismaDb.$transaction(async prisma => {
      const findUser = await prisma.user.findUnique({
        where: {
          email: session?.user.email,
        },
        include: {
          pots: true,
        },
      });

      if (!findUser) {
        return {
          message: "User not found",
          title: "Error",
        };
      }

      const pot = await prisma.pot.findUnique({
        where: {
          id: potId,
          userId: findUser.id,
        },
      });

      if (!pot) {
        return {
          message: "Pot not found",
          title: "Error",
        };
      }

      await prisma.pot.update({
        where: {
          id: pot.id,
        },
        data: {
          name: validationResult.data.name,
          target: parseFloat(validationResult.data.target),
          theme: validationResult.data.theme,
        },
      });

      revalidatePath("/dashboard/pots");
      return {
        title: "Success",
        message: "Pot updated successfully",
      };
    });
  } catch (error) {
    return { message: "Failed to update pot" };
  }
}
