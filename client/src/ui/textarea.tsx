import * as React from "react";
import { cn } from "../lib/utils";

export const Textarea = ({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={cn(
      "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-[#0A2540] shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#06B6D4]",
      className
    )}
    {...props}
  />
);
