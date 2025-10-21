import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-[#06B6D4] text-white hover:bg-[#0891B2]",
        destructive: "bg-[#d4183d] text-white hover:bg-[#b71535]",
        outline: "border bg-white text-[#0A2540] hover:bg-gray-50",
        secondary: "bg-[#F0F9FF] text-[#0A2540] hover:bg-[#e6f6fb]",
        ghost: "text-[#0A2540] hover:bg-gray-100",
        link: "text-[#06B6D4] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3",
        lg: "h-10 rounded-md px-6",
        icon: "size-9 rounded-md",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export function Button({ className, variant, size, asChild=false, ...props }){
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props}/>;
}
