import { cn } from "@/lib/utils";
import * as React from "react";

interface BudgetsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Budgets: React.FC<BudgetsProps> = ({ ...props }) => {
  return <div className={cn(props.className)}>Budgets</div>;
};

export default Budgets;
