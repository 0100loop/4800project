import * as React from "react";
import { cn } from "../lib/utils";

export const Toggle = ({
  pressed,
  onPressedChange,
  children,
  className,
}: {
  pressed: boolean;
  onPressedChange: (v: boolean) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <button
    onClick={() => onPressedChange(!pressed)}
    className={cn(
      "px-3 py-1.5 rounded-md border text-sm",
      pressed ? "bg-[#06B6D4] text-white" : "bg-white text-[#0A2540]",
      className
    )}
  >
    {children}
  </button>
);
