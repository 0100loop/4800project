import * as React from "react";
import { cn } from "../lib/utils";

export const Sidebar = ({
  open,
  onToggle,
  children,
  className,
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className="flex">
    {/* Sidebar Panel */}
    <div
      className={cn(
        "fixed md:static inset-y-0 left-0 bg-white w-64 shadow-md transition-transform",
        open ? "translate-x-0" : "-translate-x-full",
        className
      )}
    >
      <div className="p-4">{children}</div>
    </div>

    {/* Overlay for mobile */}
    {open && (
      <div
        className="fixed inset-0 bg-black/40 md:hidden"
        onClick={onToggle}
      />
    )}
  </div>
);
