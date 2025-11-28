import * as React from "react";
import { cn } from "../lib/utils";

export const Dropdown = ({
  trigger,
  children,
}: {
  trigger: React.ReactNode;
  children: React.ReactNode;
}) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative inline-block">
      <div onClick={() => setOpen((o) => !o)}>{trigger}</div>

      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-md border bg-white shadow-md z-50">
          {children}
        </div>
      )}
    </div>
  );
};

export const DropdownItem = ({
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
      "w-full px-3 py-2 text-left text-sm hover:bg-gray-100",
      className
    )}
  >
    {children}
  </button>
);
