import { cn } from "@/lib/utils";
import * as React from "react";

interface ColorLineProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string | undefined;
}

const ColorLine: React.FC<ColorLineProps> = ({ color, ...props }) => {
  return (
    <div
      className={cn("h-8 w-1 rounded", props.className)}
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorLine;
