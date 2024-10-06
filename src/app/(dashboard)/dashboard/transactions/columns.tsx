"use client";

import { User } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transactions = {
  id: string;
  category: string;
  createdAt: Date;
  amount: number;
};

export const columns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "transactionDate",
    header: "Transaction Date",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];
