import * as React from "react";
import { cn } from "../lib/utils";

// Main wrapper
export const Card = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-xl border border-gray-200 bg-white text-[#0A2540] shadow-sm",
      className
    )}
    {...props}
  />
);

// Card Header (optional)
export const CardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4", className)} {...props} />
);

// Card Content (THIS FIXES YOUR ERROR)
export const CardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4 pt-0", className)} {...props} />
);

// Card Footer (optional)
export const CardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("p-4 pt-0 flex items-center", className)} {...props} />
);
