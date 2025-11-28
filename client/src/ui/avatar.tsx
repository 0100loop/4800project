import * as React from "react";
import { cn } from "../lib/utils";

export const Avatar = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("w-10 h-10 rounded-full bg-gray-200 overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const AvatarImage = (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
  return <img className="w-full h-full object-cover" {...props} />;
};

export const AvatarFallback = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-700">
    {children}
  </div>
);
