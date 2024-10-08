"use client";
import React from "react";
import { useEffect, useState } from "react";
import AddBalance from "@/components/modals/add-transaction";
import AddBudgets from "./add-budgets";
import AddPots from "./add-pots";
import PotActinos from "./pot-actions";
import AddRecurinngBills from "./add-recurring-bills";

const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  return (
    <>
      <AddBalance />
      <AddBudgets />
      <AddPots />
      <PotActinos />
      <AddRecurinngBills />
    </>
  );
};

export default ModalProvider;
