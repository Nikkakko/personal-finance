"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modal-store";
import { Balance } from "@prisma/client";
import { PlusIcon } from "lucide-react";

interface AddPotsButtonProps {}

const AddPotsButton: React.FC<AddPotsButtonProps> = () => {
  const { openModal } = useModalStore();
  return (
    <Button onClick={() => openModal("pots", {})} className="h-12">
      <PlusIcon />
      Add New Pot
    </Button>
  );
};

export default AddPotsButton;
