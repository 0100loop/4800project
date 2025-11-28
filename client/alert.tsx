import * as React from "react";
import { cn } from "../lib/utils";

export const Alert = ({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { variant?: "default" | "destructive" }) => {
  return (
    <div
      className={cn(
        "rounded-lg border p-4 text-sm",
        variant === "destructive"
          ? "border-red-400 bg-red-50 text-red-700"
          : "border-gray-300 bg-white text-[#0A2540]",
        className
      )}
      {...props}
    />
  );
};

export const AlertTitle = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("font-medium mb-1", className)} {...props} />
);

export const AlertDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-gray-600", className)} {...props} />
);
