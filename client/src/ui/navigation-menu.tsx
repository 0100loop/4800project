import * as React from "react";
import { cn } from "../lib/utils";

export const NavigationMenu = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <nav className={cn("flex items-center gap-4", className)}>{children}</nav>
);

export const NavigationMenuItem = ({
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
      "px-4 py-2 rounded-full border border-gray-400 text-sm hover:bg-gray-100",
      className
    )}
  >
    {children}
  </button>
);
