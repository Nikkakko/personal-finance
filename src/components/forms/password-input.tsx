"use client";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pe-10", className)}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute inset-y-0 right-0 px-2 py-1"
          title={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="" size={20} />
          ) : (
            <Eye className="" size={20} />
          )}
        </button>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
