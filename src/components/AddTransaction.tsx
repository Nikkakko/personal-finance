"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modal-store";
import { Balance } from "@prisma/client";

interface AddTransactionProps {
  userEmail: string | undefined;
}

const AddTransaction: React.FC<AddTransactionProps> = ({ userEmail }) => {
  const { openModal } = useModalStore();
  return (
    <Button
      onClick={() =>
        openModal("balance", {
          userEmail,
        })
      }
    >
      Make a transaction
    </Button>
  );
};

export default AddTransaction;
