"use client";
import { themeColorMap } from "@/lib/constants";
import { capitalize, cn, formatCurrency } from "@/lib/utils";
import { Budget, Transaction } from "@prisma/client";
import * as React from "react";
import { Button } from "./ui/button";
import { EllipsisIcon } from "lucide-react";
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

  //transactions = budget.user.transactions
  const transactions = budget.user.transactions;

  const calculateCategorySpent = transactions.reduce((acc, transaction) => {
    if (transaction.category === budget.category) {
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
    <div className="flex flex-col p-8 bg-secondary shadow-sm">
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
          <PopoverTrigger>
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
                      {`"${budget.category}"`} budget.
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

        <div className="flex items-center justify-between w-1/2 ">
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
    </div>
  );
};

export default BudgetCard;
