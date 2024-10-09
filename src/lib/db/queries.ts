import { unstable_cache, revalidateTag } from "next/cache";
import { prismaDb } from "./prisma";
import { auth } from "@/auth";

/* 
export let getAllSongs = unstable_cache(
  async () => {
    return db.select().from(songs).orderBy(asc(songs.name));
  },
  ['all-songs'],
  { tags: ['songs'] }
);

*/

export let getAllTransactions = unstable_cache(
  async () => {
    return prismaDb.transaction.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  },
  ["all-transactions"],
  { tags: ["transactions"] }
);

export let getTransactionById = unstable_cache(
  async (id: string) => {
    return prismaDb.transaction.findFirst({
      where: {
        id,
      },
    });
  },
  ["transaction-by-id"],
  { tags: ["transactions"] }
);

export let getUserFromDb = (email: string) => {
  return prismaDb.user.findFirst({
    where: {
      email,
    },
    include: {
      balance: true,
      budgets: true,
      transactions: true,
      pots: true,
    },
  });
};

// export let getUserFromDb = unstable_cache(
//   async (email: string) => {
//     return prisma.user.findFirst({
//       where: {
//         email,
//       },
//       include: {
//         balances: true,
//         budgets: true,
//         transactions: true,
//         pots: true,
//       },

//       distinct: ["password"],
//     });
//   },
//   ["user-by-email"],
//   { tags: ["users"] }
// );

export let getUserTransactions = unstable_cache(
  async (email: string) => {
    const user = await prismaDb.user.findFirst({
      where: {
        email,
      },
    });

    if (!user) return null;

    return prismaDb.transaction.findMany({
      where: {
        userId: user.id,
      },

      orderBy: {
        createdAt: "asc",
      },
    });
  },
  ["user-transactions"],
  { tags: ["transactions"] }
);

export let getUserBudgets = async () => {
  const session = await auth();
  if (!session) return null;
  const user = await prismaDb.user.findFirst({
    where: {
      email: session?.user.email,
    },
  });

  if (!user) return null;

  return prismaDb.budget.findMany({
    where: {
      userId: user.id,
    },

    orderBy: {
      createdAt: "asc",
    },

    include: {
      user: {
        select: {
          transactions: true,
        },
      },
    },
  });
};

export let getUserPots = async () => {
  const session = await auth();
  if (!session) return null;
  const user = await prismaDb.user.findFirst({
    where: {
      email: session?.user.email,
    },
  });

  if (!user) return null;

  return prismaDb.pot.findMany({
    where: {
      userId: user.id,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};

export let getRecurringBills = async () => {
  const session = await auth();
  if (!session) return null;
  const user = await prismaDb.user.findFirst({
    where: {
      email: session?.user.email,
    },
  });

  if (!user) return null;

  return prismaDb.recurringBill.findMany({
    where: {
      userId: user.id,
    },

    orderBy: {
      createdAt: "asc",
    },
  });
};
