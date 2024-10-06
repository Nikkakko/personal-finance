import { cn } from "@/lib/utils";
import * as React from "react";

interface ReccuringBillsProps extends React.HTMLAttributes<HTMLDivElement> {}

const ReccuringBills: React.FC<ReccuringBillsProps> = ({ ...props }) => {
  return <div className={cn(props.className)}>ReccuringBills</div>;
};

export default ReccuringBills;
