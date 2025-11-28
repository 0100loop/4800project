import * as React from "react";
import { cn } from "../lib/utils";

export interface SwitchProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onCheckedChange, ...props }, ref) => {
    const [internal, setInternal] = React.useState<boolean>(
      defaultChecked ?? false
    );

    const isOn = checked !== undefined ? checked : internal;

    const toggle = () => {
      const next = !isOn;
      setInternal(next);
      onCheckedChange?.(next);
    };

    return (
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "relative inline-flex h-6 w-10 items-center rounded-full transition-colors",
          isOn ? "bg-[#06B6D4]" : "bg-gray-300",
          className
        )}
      >
        <span
          className={cn(
            "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform",
            isOn ? "translate-x-4" : "translate-x-1"
          )}
        />
        <input
          ref={ref}
          type="checkbox"
          className="hidden"
          checked={isOn}
          readOnly
          {...props}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
