import * as React from "react";
import { cn } from "../lib/utils";

export interface CheckboxProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange"
  > {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="inline-flex items-center gap-2 cursor-pointer">
        <input
          ref={ref}
          type="checkbox"
          className={cn(
            "h-4 w-4 rounded border border-gray-300 text-[#06B6D4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]",
            className
          )}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          {...props}
        />
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";
