import * as React from "react";
import { cn } from "../lib/utils";

export const RadioGroup = ({
  children,
  value,
  onChange,
}: {
  children: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
}) => {
  return <div className="flex flex-col gap-2">{children}</div>;
};

export const RadioGroupItem = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input
      type="radio"
      checked={checked}
      onChange={onChange}
      className="h-4 w-4 text-[#06B6D4]"
    />
    <span className="text-sm text-[#0A2540]">{label}</span>
  </label>
);
