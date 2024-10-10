import { cn, formatCurrency } from "@/lib/utils";
import { Transaction } from "@prisma/client";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import HeadingTitle from "./heading-title";
import { format } from "date-fns";
import { themeColorMap } from "@/lib/constants";

interface TransactionsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Transaction[] | undefined;
}

const Transactions: React.FC<TransactionsProps> = ({ data, ...props }) => {
  return (
    <div
      className={cn(
        props.className,
        "flex flex-col bg-white rounded shadow-sm p-5"
      )}
    >
      <HeadingTitle
        title="Transactions"
        href="/dashboard/transactions"
        hrefText="View all"
      />

      <div className="mt-5">
        {data
          ?.map(transaction => (
            <Link
              key={transaction.id}
              href={`/dashboard/transactions/${transaction.id}`}
              passHref
            >
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div className="flex gap-2 items-center">
                  <div className="bg-theme-navyGray w-10 h-10 rounded-full"></div>
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-primary capitalize">
                      {transaction.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <p
                    className={cn(
                      "text-base font-bold text-end",
                      transaction.type === "EXPENSE" && "text-theme-navy",
                      transaction.type === "INCOME" && "text-theme-green"
                    )}
                  >
                    {transaction.type === "EXPENSE" ? "-" : "+"}
                    {formatCurrency(transaction.amount, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      currency: "USD",
                      style: "currency",
                    })}
                  </p>
                  {/* add date */}
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                  </p>
                </div>
              </div>
            </Link>
          ))
          .slice(0, 5)}
      </div>
    </div>
  );
};

export default Transactions;
