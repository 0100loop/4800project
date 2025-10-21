import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 gap-1 transition-[color,box-shadow] focus-visible:ring-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#0A2540] text-white hover:bg-[#0A2540]/90",
        secondary: "border-transparent bg-[#F0F9FF] text-[#0A2540]",
        destructive: "border-transparent bg-[#d4183d] text-white",
        outline: "text-[#0A2540] border border-[#0A2540]/20",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export function Badge({ className, variant, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "span";
  return <Comp className={cn(badgeVariants({ variant }), className)} {...props} />;
}
export { badgeVariants };
