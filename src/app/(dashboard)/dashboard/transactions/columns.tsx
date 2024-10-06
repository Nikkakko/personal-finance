"use client";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { Category, TransactionType } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transactions = {
  id: string;
  category: Category;
  type: TransactionType;
  description: string | null;
  date: Date;
  amount: number;
};

export const columns: ColumnDef<Transactions>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const category = row.getValue("category") as Category;

      return (
        <div className="text-left max-w-fit">
          {
            //capitalize
            category
              .toLowerCase()
              .replace(/\b[a-z]/g, letter => letter.toUpperCase())
          }
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const type = row.getValue("type") as TransactionType;

      return (
        <div className="text-left max-w-fit">
          {type === "EXPENSE" ? (
            <span className="text-red-500">Expense</span>
          ) : (
            <span className="text-green-500">Income</span>
          )}
        </div>
      );
    },
  },

  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;

      return (
        <div className="text-left max-w-fit capitalize">
          {description || "-"}
        </div>
      );
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));

      return (
        <div className="text-center max-w-fit">
          {format(date, "dd/MM/yyyy")}
        </div>
      );
    },

    // This is used to sort the column by date
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-0"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      //color based on type
      if (row.getValue("type") === "EXPENSE") {
        return (
          <div className="text-red-500 font-medium">
            - {formatCurrency(amount)}
          </div>
        );
      } else {
        return (
          <div className="text-green-500 font-medium">
            {formatCurrency(amount)}
          </div>
        );
      }
    },
  },

  {
    accessorKey: "actions",
    header: () => <div className="text-right">Actions</div>,
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-end gap-1">
          <Button variant="outline" disabled>
            Edit
          </Button>
          <Button variant="destructive" disabled>
            Delete
          </Button>
        </div>
      );
    },
  },
];
