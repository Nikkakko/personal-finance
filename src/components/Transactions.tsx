import { cn } from "@/lib/utils";
import * as React from "react";

interface TransactionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Transactions: React.FC<TransactionsProps> = ({ ...props }) => {
  return <div className={cn(props.className)}>Transactions</div>;
};

export default Transactions;
