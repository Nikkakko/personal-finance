"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modal-store";
import { Balance } from "@prisma/client";

interface AddTransactionProps {
  
}

const AddTransaction: React.FC<AddTransactionProps> = () => {
  const { openModal } = useModalStore();
  return (
    <Button onClick={() => openModal("balance", {})}>Make a transaction</Button>
  );
};

export default AddTransaction;
