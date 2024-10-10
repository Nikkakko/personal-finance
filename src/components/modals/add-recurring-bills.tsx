"use client";
import * as React from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { addRecurringBillSchema } from "@/lib/validaton";
import { useToast } from "@/hooks/use-toast";
import { addRecurringBillAction } from "@/lib/actions/add-bills-action";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { frequencySelect } from "@/lib/constants";
import { Textarea } from "../ui/textarea";

interface AddRecurinngBillsProps {}

const AddRecurinngBills: React.FC<AddRecurinngBillsProps> = ({}) => {
  const { modal, closeModal, modalData } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const isOpen = modal === "recurring-bills" ? true : false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof addRecurringBillSchema>>({
    resolver: zodResolver(addRecurringBillSchema),
    defaultValues: {
      amount: "",
      description: "",
      dueDate: undefined,
      isPaid: false,
      frequency: "MONTHLY",
    },
  });

  // 2. Define your form submit handler.
  const onSubmit = form.handleSubmit(async values => {
    startTransition(() => {
      addRecurringBillAction({
        values,
      });
    });
  });

  const handleClose = React.useCallback(() => {
    closeModal();
    form.reset();
  }, [closeModal, form]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={prev => !prev && handleClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recurring Bill</DialogTitle>
          <DialogDescription>
            Add a recurring bill to your budget.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={onSubmit} className="space-y-4">
            {/* name */}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <Input {...field} placeholder="Enter a title" />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <Input {...field} placeholder="Enter amount" />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="frequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Frequency</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {frequencySelect.map(item => (
                        <SelectItem
                          key={item.id}
                          value={item.value}
                          //disabled if budget already exists
                          className="disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-500"
                        >
                          {item.label}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <Textarea {...field} placeholder="Enter description" />
                  <FormDescription>Optional</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={date =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    {/* due date */}
                    Select a date when the bill is due.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-11" disabled={isPending}>
              Add Bill
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddRecurinngBills;
