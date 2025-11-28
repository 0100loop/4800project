import * as React from "react";

export const ScrollArea = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={`overflow-auto max-h-64 pr-2 ${className}`}>
      {children}
    </div>
  );
};
