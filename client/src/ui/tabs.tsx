import * as React from "react";
import { cn } from "../lib/utils";

const TabsContext = React.createContext<any>(null);

export const Tabs = ({
  defaultValue,
  children,
  className,
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [value, setValue] = React.useState(defaultValue);
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
};

export const TabsList = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "grid w-full grid-cols-2 bg-gray-100 rounded-xl p-1",
      className
    )}
  >
    {children}
  </div>
);

export const TabsTrigger = ({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const ctx = React.useContext(TabsContext);
  const active = ctx.value === value;

  return (
    <button
      onClick={() => ctx.setValue(value)}
      className={cn(
        "px-3 py-2 rounded-xl text-sm",
        active ? "bg-white shadow text-[#0A2540]" : "text-gray-500",
        className
      )}
    >
      {children}
    </button>
  );
};

export const TabsContent = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const ctx = React.useContext(TabsContext);
  if (ctx.value !== value) return null;
  return <div>{children}</div>;
};
