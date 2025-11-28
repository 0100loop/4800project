import * as React from "react";
import { cn } from "../lib/utils";

export const Menubar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 bg-white border rounded-md px-3 py-1 shadow-sm",
      className
    )}
  >
    {children}
  </div>
);

export const MenubarItem = ({
  children,
  onClick,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "px-3 py-1 text-sm hover:bg-gray-100 rounded-md",
      className
    )}
  >
    {children}
  </button>
);
