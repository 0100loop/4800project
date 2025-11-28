import * as React from "react";
import { cn } from "../lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: "default" | "soft" | "underline";
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const variants = {
      default:
        "border border-gray-300 rounded-md px-3 py-2 shadow-sm bg-white",
      soft:
        "bg-gray-100 border border-gray-200 rounded-md px-3 py-2 shadow-inner",
      underline:
        "border-b border-gray-400 bg-transparent px-1 py-2 rounded-none",
    };

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";

