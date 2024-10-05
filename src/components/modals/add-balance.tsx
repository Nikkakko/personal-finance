"use client";
import * as React from "react";
import { useModalStore } from "@/store/modal-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addBalanceSchema } from "@/lib/validaton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateBalanceAction } from "@/lib/actions/add-balance-action";

interface AddBalanceProps {}

const AddBalance: React.FC<AddBalanceProps> = ({}) => {
  const { modal, closeModal, modalData } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const isOpen = modal === "balance" ? true : false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof addBalanceSchema>>({
    resolver: zodResolver(addBalanceSchema),
    defaultValues: {
      current: "",
      income: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof addBalanceSchema>) {
    startTransition(async () => {
      const res = await updateBalanceAction({
        id: modalData?.balance?.id ?? "",
        email: modalData?.balance?.userEmail ?? "",
        values,
      });

      if (res?.message === "Balance updated successfully") {
        closeModal();
        form.reset();
      }
    });
  }

  const handleClose = React.useCallback(() => {
    closeModal();
    form.reset();
  }, [closeModal, form]);

  React.useEffect(() => {
    // 1. Set the form values to the modal data.
    if (modalData?.balance) {
      form.setValue("current", modalData.balance.current.toString());
      form.setValue("income", modalData.balance.income.toString());
    }

    return () => {
      form.reset();
    };
  }, [form, modalData?.balance]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={prev => !prev && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Balance</DialogTitle>
          <DialogDescription>
            Add your current balance, income, and expenses
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="current"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Balance</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter your current balance</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="income"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Income</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>Enter your income</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBalance;
