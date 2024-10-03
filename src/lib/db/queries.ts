import { unstable_cache, revalidateTag } from "next/cache";
import { prisma } from "./prisma";

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
    return prisma.transaction.findMany({
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
    return prisma.transaction.findFirst({
      where: {
        id,
      },
    });
  },
  ["transaction-by-id"],
  { tags: ["transactions"] }
);

export let getUserFromDb = (email: string) => {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
};
