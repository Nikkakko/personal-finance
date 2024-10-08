"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modal-store";

interface AddBudgetsButtonProps {}

const AddBudgetsButton: React.FC<AddBudgetsButtonProps> = ({}) => {
  const { openModal } = useModalStore();
  return <Button onClick={() => openModal("budget", {})}>Add Budget</Button>;
};

export default AddBudgetsButton;
