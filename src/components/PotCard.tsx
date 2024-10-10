"use client";
import { Pot } from "@prisma/client";
import * as React from "react";
import ColorLine from "./ColorLine";
import { themeColorMap } from "@/lib/constants";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { EllipsisIcon, PlusIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modal-store";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { capitalize, cn, formatCurrency } from "@/lib/utils";
import { Progress } from "./ui/progress";
import { deletePotAction } from "@/lib/actions/add-pot-action";

interface PotCardProps {
  pot: Pot;
}

const PotCard: React.FC<PotCardProps> = ({ pot }) => {
  const { openModal } = useModalStore();
  const [isPending, startTransition] = React.useTransition();

  return (
    <div className="flex flex-col p-2 lg:p-5 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <ColorLine
            color={themeColorMap[pot.theme]}
            className="rounded-full w-5 h-5"
          />

          <h2 className="text-lg font-bold capitalize">{pot.name}</h2>
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
                  openModal("pots", { isEdit: true, pot });
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
                      {`"${capitalize(pot.name)}"`} pot.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive hover:bg-destructive/90"
                      disabled={isPending}
                      onClick={() => {
                        startTransition(async () => {
                          await deletePotAction({ potId: pot.id });
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

      <div className="flex flex-col mt-10">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold text-muted-foreground">
            Total Saved
          </p>
          <p className={cn("text-lg font-bold")}>
            {formatCurrency(pot.total, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              currency: "USD",
              style: "currency",
            })}
          </p>
        </div>

        <Progress
          value={pot.total}
          max={pot.target}
          className="h-3 mt-2 rounded"
          indicatorColor={themeColorMap[pot.theme]}
        />

        <div className="flex items-center justify-between w-full mt-2">
          {/* percentage -  target amount */}
          <p className="text-sm text-muted-foreground">
            {Math.round((pot.total / pot.target) * 100)}%
          </p>

          <p className="text-sm text-muted-foreground">
            Target of{" "}
            {formatCurrency(pot.target, {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              currency: "USD",
              style: "currency",
            })}
          </p>
        </div>
      </div>

      <div className="mt-10 flex gap-2 w-full ">
        {/* add money Withdraw money */}
        <Button
          onClick={() => {
            openModal("pot", { isEdit: false, potType: "add-money", pot: pot });
          }}
          className="w-full h-12"
        >
          <PlusIcon />
          Add Money
        </Button>

        <Button
          onClick={() => {
            openModal("pot", {
              isEdit: false,
              potType: "withdraw-money",
              pot: pot,
            });
          }}
          className="w-full h-12"
        >
          Withdraw
        </Button>
      </div>
    </div>
  );
};

export default PotCard;
