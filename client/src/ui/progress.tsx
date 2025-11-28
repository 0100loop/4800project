import * as React from "react";
import { cn } from "../lib/utils";

export const Progress = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => (
  <div
    className={cn(
      "w-full h-2 bg-gray-200 rounded-full overflow-hidden",
      className
    )}
  >
    <div
      className="h-full bg-[#06B6D4] transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
);
