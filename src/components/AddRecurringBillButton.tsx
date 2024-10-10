"use client";
import { useModalStore } from "@/store/modal-store";
import * as React from "react";
import { Button } from "./ui/button";

interface AddRecurringBillButtonProps {}

const AddRecurringBillButton: React.FC<AddRecurringBillButtonProps> = ({}) => {
  const { openModal } = useModalStore();
  return (
    <Button onClick={() => openModal("recurring-bills")}>
      Add Recurring Bill
    </Button>
  );
};

export default AddRecurringBillButton;
