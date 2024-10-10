"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Frequency } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { format, getDate, isBefore } from "date-fns";
import { ArrowUpDown, CheckIcon, OctagonAlertIcon } from "lucide-react";

export type Payment = {
  id: string;
  title: string;
  dueDate: Date;
  frequency: Frequency;
  amount: number;
  isPaid: boolean;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0 "
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "date",
    accessorFn: row => `${row.frequency} - ${getDate(row.dueDate)}`,
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
      const frequency = row.original.frequency;
      const dueDate = row.original.dueDate;
      const isPaid = row.original.isPaid;
      const dayOfMonth = getDate(dueDate);
      const suffix = getDaySuffix(dayOfMonth);
      const currentTime = new Date();

      let formattedDate = "";
      switch (frequency) {
        case "DAILY":
          formattedDate = "Daily";
          break;
        case "WEEKLY":
          formattedDate = `Weekly - ${format(dueDate, "EEEE")}`;
          break;
        case "MONTHLY":
          formattedDate = `Monthly - ${dayOfMonth}${suffix}`;
          break;
        case "YEARLY":
          formattedDate = `Yearly - ${format(dueDate, "MMMM d")}${suffix}`;
          break;
        default:
          formattedDate = format(dueDate, "PP");
      }

      // Determine the color based on isPaid and due date
      let colorClass = "";
      let isBeforeDate = isBefore(dueDate, currentTime) ? true : false;
      if (isPaid) {
        colorClass = "text-theme-green";
      } else if (isBeforeDate) {
        colorClass = "text-theme-red";
      }

      return (
        <div
          className={cn(
            "text-center max-w-fit flex items-center gap-1",
            colorClass
          )}
        >
          {formattedDate}{" "}
          {isPaid && !isBeforeDate && (
            <CheckIcon className={cn("w-4 h-4 text-theme-green")} />
          )}
          {isBeforeDate && !isPaid && (
            <OctagonAlertIcon className={cn("w-4 h-4 text-theme-red")} />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="px-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];

// Helper function to get the correct suffix for the day of the month
function getDaySuffix(day: number): string {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
