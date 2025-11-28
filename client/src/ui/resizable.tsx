import * as React from "react";

export const ResizablePanel = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`resize overflow-auto border p-4 ${className}`}>
    {children}
  </div>
);
