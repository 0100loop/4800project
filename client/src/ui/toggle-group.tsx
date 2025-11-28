import * as React from "react";

export const ToggleGroup = ({
  children,
  value,
  onValueChange,
}: {
  children: React.ReactNode;
  value: string;
  onValueChange: (v: string) => void;
}) => (
  <div className="flex gap-2">{children}</div>
);

export const ToggleGroupItem = ({
  value,
  selected,
  onSelect,
  children,
}: {
  value: string;
  selected: boolean;
  onSelect: (v: string) => void;
  children: React.ReactNode;
}) => (
  <button
    onClick={() => onSelect(value)}
    className={`px-3 py-1 rounded-md border text-sm ${
      selected ? "bg-[#06B6D4] text-white" : "bg-white text-[#0A2540]"
    }`}
  >
    {children}
  </button>
);
