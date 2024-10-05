"use client";
import * as React from "react";
import { Button } from "./ui/button";
import { useModalStore } from "@/store/modal-store";
import { Balance } from "@prisma/client";

interface AddBalanceButtonProps {
  userBalance: Balance | undefined;
  userEmail: string | undefined;
}

const AddBalanceButton: React.FC<AddBalanceButtonProps> = ({
  userBalance,
  userEmail,
}) => {
  const { openModal } = useModalStore();
  return (
    <Button
      onClick={() =>
        openModal("balance", {
          balance: {
            current: userBalance?.current ?? 0,
            income: userBalance?.income ?? 0,
            id: userBalance?.id ?? "",
            userEmail: userEmail ?? "",
          },
        })
      }
    >
      Update Balance
    </Button>
  );
};

export default AddBalanceButton;
