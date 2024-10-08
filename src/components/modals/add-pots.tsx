"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModalStore } from "@/store/modal-store";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addPotSchema } from "@/lib/validaton";
import { addPotAction, updatePotAction } from "@/lib/actions/add-pot-action";
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
import { themeSelect } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";

interface AddPotsProps {}

const AddPots: React.FC<AddPotsProps> = ({}) => {
  const { modal, closeModal, modalData } = useModalStore();
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const isOpen = modal === "pots" ? true : false;

  // 1. Define your form.
  const form = useForm<z.infer<typeof addPotSchema>>({
    resolver: zodResolver(addPotSchema),
    defaultValues: {
      name: "",
      target: "",
      theme: undefined,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof addPotSchema>) {
    startTransition(async () => {
      if (modalData?.isEdit && modalData?.pot) {
        const res = await updatePotAction({
          values,
          potId: modalData.pot.id,
        });

        if ("message" in res && "title" in res) {
          toast({
            title: res.title,
            description: res.message,
          });
          closeModal();
          form.reset();
        }
      }
      const res = await addPotAction({
        values,
      });

      if (res?.message === "Pot added successfully") {
        toast({
          title: "Pot added",
        });
        closeModal();
        form.reset();
      }
    });
  }

  const handleClose = React.useCallback(() => {
    closeModal();
    form.reset();
  }, [closeModal, form]);

  const isDisabled = form.formState.isSubmitting || isPending;

  React.useEffect(() => {
    if (modalData?.isEdit && modalData?.pot) {
      form.setValue("name", modalData.pot.name);
      form.setValue("target", modalData.pot.target.toString());
      form.setValue("theme", modalData.pot.theme);
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
            {modalData?.isEdit ? "Edit Pot" : "Add a new pot"}
          </DialogTitle>
          <DialogDescription>
            {modalData?.isEdit
              ? "Edit the pot details below, then click save to update the pot."
              : "Create a pot to set savings targets. These can help keep you on track as you save for special purchases."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g Rainy days" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="target"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="e.g 200" />
                  </FormControl>
                  <FormDescription>
                    This is the amount you want to save.
                  </FormDescription>
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
            <Button type="submit" disabled={isDisabled} className="w-full h-12">
              {modalData?.isEdit ? "Save Changes" : "Add Pot"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddPots;
