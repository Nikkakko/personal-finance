"use client";
import { themeColorMap } from "@/lib/constants";
import { capitalize, cn, formatCurrency } from "@/lib/utils";
import { Budget, Transaction } from "@prisma/client";
import * as React from "react";
import { Button } from "./ui/button";
import { ArrowRightIcon, EllipsisIcon } from "lucide-react";
import { Progress } from "./ui/progress";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteBudgetAction } from "@/lib/actions/add-budget-action";
import { useModalStore } from "@/store/modal-store";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface BudgetCardProps {
  budget: Budget & {
    user: {
      transactions: Transaction[];
    };
  };
}

const BudgetCard: React.FC<BudgetCardProps> = ({ budget }) => {
  const [isPending, startTransition] = React.useTransition();
  const { openModal } = useModalStore();
  const router = useRouter();

  //transactions = budget.user.transactions
  const transactions = budget.user.transactions;

  const calculateCategorySpent = transactions.reduce((acc, transaction) => {
    if (
      transaction.category === budget.category &&
      transaction.type === "EXPENSE"
    ) {
      acc += transaction.amount;
    }
    return acc;
  }, 0);

  const spentRemainingList = [
    {
      title: "Spent",
      amount: calculateCategorySpent,
    },
    {
      title: "Remaining",
      amount: budget.maximum - calculateCategorySpent,
    },
  ];

  return (
    <div className="flex flex-col p-2 lg:p-8 bg-white shadow-sm rounded">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div
            className={cn("w-8 h-8 rounded-full")}
            style={{ backgroundColor: themeColorMap[budget.theme] }}
          />
          <h2 className="text-lg font-semibold">
            {capitalize(budget.category)}
          </h2>
        </div>

        <Popover>
          <PopoverTrigger className="active:scale-95">
            <EllipsisIcon />
          </PopoverTrigger>
          <PopoverContent className="max-w-[150px]">
            <div className="flex flex-col gap-2 max-w-full">
              <Button
                variant="ghost"
                className="text-left"
                onClick={() => {
                  openModal("budget", { isEdit: true, budget });
                }}
              >
                Edit
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="text-left">
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete{" "}
                      {`"${capitalize(budget.category)}"`} budget.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await deleteBudgetAction({
                            id: budget.id,
                          });
                        });
                      }}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-col mt-5 gap-4">
        <p className="">
          Maximum of:{" "}
          {formatCurrency(budget.maximum, {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
            currency: "USD",
            style: "currency",
          })}
        </p>
        <Progress
          value={calculateCategorySpent}
          max={budget.maximum}
          className="h-8 rounded"
          indicatorColor={themeColorMap[budget.theme]}
        />

        <div className="flex items-center justify-between w-full lg:w-1/2 ">
          {spentRemainingList.map((item, index) => (
            <div key={index} className="flex gap-2">
              <div
                className={cn("w-1 h-10 rounded")}
                style={
                  item.title !== "Remaining"
                    ? { backgroundColor: themeColorMap[budget.theme] }
                    : { backgroundColor: "#9e9e9e" }
                }
              />
              <div className="flex flex-col ">
                <p className="text-sm text-muted-foreground ">{item.title}</p>
                <p className="text-sm font-bold">
                  {formatCurrency(item.amount, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    currency: "USD",
                    style: "currency",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* latest spendings */}

      {transactions
        .filter(
          transaction =>
            transaction.category === budget.category &&
            transaction.type === "EXPENSE"
        )
        .slice(0, 3).length === 0 ? null : (
        <div className="mt-5 bg-theme-background rounded shadow-sm p-5">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-lg font-semibold">Latest Spendings</h3>
            {/* see all */}
            <Button
              variant="ghost"
              className="px-0 hover:px-4 transition-all "
              onClick={() => {
                router.push(
                  `/dashboard/transactions?queryT=${budget.category.toLowerCase()}`
                );
              }}
            >
              See All <ArrowRightIcon className="w-4 h-4 ml-1 text-primary" />
            </Button>
          </div>
          <div className="flex flex-col gap-3 mt-3">
            {transactions
              .filter(transaction => transaction.category === budget.category)
              .slice(0, 3)
              .map(transaction => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between w-full"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn("w-2 h-8 rounded")}
                      style={{
                        backgroundColor: themeColorMap[budget.theme],
                      }}
                    />
                    <p className="text-sm text-muted-foreground">
                      {transaction.description}
                    </p>
                  </div>
                  {/* date */}
                  <div className="flex flex-col items-end gap-2">
                    <p className="text-sm font-semibold">
                      -
                      {formatCurrency(transaction.amount, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        currency: "USD",
                        style: "currency",
                      })}
                    </p>
                    <p className="text-muted-foreground text-end">
                      {format(transaction.date, "dd MMM yyyy")}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
