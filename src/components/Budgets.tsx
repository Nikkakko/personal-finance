import { cn } from "@/lib/utils";
import { Budget } from "@prisma/client";
import * as React from "react";

interface BudgetsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Budget[] | undefined;
}

const Budgets: React.FC<BudgetsProps> = ({ data, ...props }) => {
  return <div className={cn(props.className)}>Budgets</div>;
};

export default Budgets;
