"use client";
import React from "react";
import { useEffect, useState } from "react";
import AddBalance from "@/components/modals/add-balance";

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
    </>
  );
};

export default ModalProvider;
