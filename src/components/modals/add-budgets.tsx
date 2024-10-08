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
import { addBudgetSchema } from "@/lib/validaton";
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
import { addTransactionAction } from "@/lib/actions/add-transaction-action";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { addBudgetAction } from "@/lib/actions/add-budget-action";
import { categoriesSelect, themeSelect } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";

interface AddBudgetsProps {}

const AddBudgets: React.FC<AddBudgetsProps> = ({}) => {
  const { modal, closeModal, modalData } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const isOpen = modal === "budget" ? true : false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof addBudgetSchema>>({
    resolver: zodResolver(addBudgetSchema),
    defaultValues: {
      category: undefined,
      maximum: "",
      theme: undefined,
    },
  });

  // 2. Define your submit handler.
  const onSubmit = form.handleSubmit(data => {
    startTransition(async () => {
      const res = await addBudgetAction({
        values: data,
      });

      if (res?.message === "Budget already exists") {
        toast({
          title: "Budget already exists",
          description: "You have already set a budget for this category",
        });
      }

      if (res?.message === "Budget added successfully") {
        //toast based on edit
        toast({
          title: modalData?.isEdit ? "Budget updated" : "Budget added",
        });
        closeModal();
        form.reset();
      }
    });
  });

  const handleClose = React.useCallback(() => {
    closeModal();
    form.reset();
  }, [closeModal, form]);

  const isDisabled =
    !form.formState.isDirty || !form.formState.isValid || isPending;

  React.useEffect(() => {
    if (modalData?.budget) {
      //set values
      form.setValue("category", modalData.budget.category);
      form.setValue("maximum", modalData.budget.maximum.toString());
      form.setValue("theme", modalData.budget.theme);
    }

    return () => {
      form.reset();
    };
  }, [form, modalData]);

  if (!isOpen) return null;
  return (
    <Dialog open={isOpen} onOpenChange={prev => !prev && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {modalData?.isEdit ? "Edit Budget" : "Add New Budget"}
          </DialogTitle>
          <DialogDescription>
            {modalData?.isEdit
              ? "As your budgets change, feel free to update your spending limits."
              : "Choose a category to set a spending budget. Those categories will be used to track your spending."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categoriesSelect.map(item => (
                        <SelectItem
                          key={item.id}
                          value={item.value}
                          //disabled if budget already exists
                          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-500"
                        >
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="maximum"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Spend</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="theme"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Theme</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a theme" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {themeSelect.map(item => (
                        <SelectItem key={item.id} value={item.value}>
                          <div className="flex items-center gap-4">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{
                                backgroundColor: item.color,
                              }}
                            />

                            {item.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-11" disabled={isDisabled}>
              {modalData?.isEdit ? "Save Changes" : "Add Budget"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgets;
