import { cn } from "@/lib/utils";
import * as React from "react";

interface PotsProps extends React.HTMLAttributes<HTMLDivElement> {}

const Pots: React.FC<PotsProps> = ({ ...props }) => {
  return <div className={cn(props.className)}>Pots</div>;
};

export default Pots;
