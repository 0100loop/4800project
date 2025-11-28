import * as React from "react";

export const Collapsible = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) => <div>{children}</div>;

export const CollapsibleTrigger = ({
  open,
  onToggle,
  children,
}: {
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => (
  <button
    className="font-medium flex w-full justify-between items-center py-2"
    onClick={onToggle}
  >
    {children}
    <span>{open ? "▲" : "▼"}</span>
  </button>
);

export const CollapsibleContent = ({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) =>
  open ? <div className="pl-2 text-gray-600">{children}</div> : null;
