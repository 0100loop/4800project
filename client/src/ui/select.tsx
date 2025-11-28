import * as React from "react";
import { cn } from "../lib/utils";

export const Select = ({
  value,
  onChange,
  children,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={cn(
      "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm",
      className
    )}
  >
    {children}
  </select>
);

export const SelectGroup = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <>
    <optgroup label={label}>{children}</optgroup>
  </>
);

export const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => <option value={value}>{children}</option>;
