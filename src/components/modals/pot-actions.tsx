"use client";
import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { useModalStore } from "@/store/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { potActionSchema } from "@/lib/validaton";
import { Button } from "../ui/button";
import {
  Form,
  FormField,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";
import { Progress } from "../ui/progress";
import { themeColorMap } from "@/lib/constants";
import { cn, formatCurrency } from "@/lib/utils";
import { potAction } from "@/lib/actions/add-pot-action";

interface PotActinosProps {}

const PotActinos: React.FC<PotActinosProps> = () => {
  const { modal, closeModal, modalData } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const isOpen = modal === "pot" ? true : false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof potActionSchema>>({
    resolver: zodResolver(potActionSchema),
    defaultValues: {
      amount: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof potActionSchema>) {
    startTransition(async () => {
      const res = await potAction({
        values,
        action:
          modalData?.potType === "add-money" ? "add-money" : "withdraw-money",
        potId: modalData?.pot?.id,
      });

      if ("message" in res && "title" in res) {
        toast({
          title: res.title,
          description: res.message,
        });
      }

      form.reset();
      closeModal();
    });
  }

  const handleClose = React.useCallback(() => {
    closeModal();
    form.reset();
  }, [form, closeModal]);

  const watchAmount = form.watch("amount");

  const totalAmount =
    modalData?.potType === "add-money"
      ? (modalData?.pot?.total ?? 0) + Number(watchAmount)
      : (modalData?.pot?.total ?? 0) - Number(watchAmount);

  const checkTarget = modalData?.pot?.target ?? 0;
  const checkIndicatorColor =
    modalData?.pot?.theme && themeColorMap[modalData.pot.theme];

  // TotalAmount, modalData?.pot?.target
  const calculatePercentage = Math.round((totalAmount / checkTarget) * 100);
  const checkMaxValue = totalAmount > checkTarget ? totalAmount : checkTarget;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={prev => !prev && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {modalData?.potType === "add-money"
              ? "Add Money to Savings"
              : "Withdraw from Savings"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-10 flex flex-col">
          <div className="flex items-center justify-between w-full">
            <p className="text-base font-semibold text-muted-foreground">
              New Amount
            </p>
            {/* totalSaved + amount */}
            <p className={cn("text-lg font-bold")}>
              {formatCurrency(totalAmount, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                currency: "USD",
                style: "currency",
              })}
            </p>
          </div>

          <Progress
            value={totalAmount}
            max={checkMaxValue}
            className="h-3 mt-2 rounded"
            indicatorColor={checkIndicatorColor as string}
          />

          <div className="flex items-center justify-between w-full mt-2">
            {/* percetnage of totalAmount */}
            <p
              className="text-sm text-muted-foreground"
              style={{
                color:
                  totalAmount > (modalData?.pot?.total ?? 0)
                    ? checkIndicatorColor
                    : "black",
              }}
            >
              {calculatePercentage}%
            </p>

            <p className="text-sm text-muted-foreground">
              Target of{" "}
              {formatCurrency(modalData?.pot?.target ?? 0, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
                currency: "USD",
                style: "currency",
              })}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Amount to{" "}
                    {modalData?.potType === "add-money" ? "Add" : "Withdraw"}{" "}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g Rainy days" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting || isPending}
              className="w-full h-12 mt-6"
            >
              {modalData?.potType === "add-money"
                ? "Confirm Addition"
                : "Confirm Withdrawal"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PotActinos;
