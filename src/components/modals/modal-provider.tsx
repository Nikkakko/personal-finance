"use client";
import React from "react";
import { useEffect, useState } from "react";
import AddBalance from "@/components/modals/add-transaction";
import AddBudgets from "./add-budgets";

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
    </>
  );
};

export default ModalProvider;
