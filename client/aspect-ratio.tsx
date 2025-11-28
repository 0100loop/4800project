import * as React from "react";

export const AspectRatio = ({
  ratio = 16 / 9,
  children,
  className,
}: {
  ratio?: number;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{ paddingBottom: `${100 / ratio}%` }}
    >
      <div className="absolute inset-0">{children}</div>
    </div>
  );
};
