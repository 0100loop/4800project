import * as React from "react";
import { cn } from "../lib/utils";

export const Breadcrumb = ({ children, className }: any) => (
  <nav className={cn("text-sm text-gray-600", className)}>{children}</nav>
);

export const BreadcrumbList = ({ children, className }: any) => (
  <ol className={cn("flex items-center gap-2", className)}>{children}</ol>
);

export const BreadcrumbItem = ({ children, className }: any) => (
  <li className={cn("flex items-center", className)}>{children}</li>
);

export const BreadcrumbLink = ({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) => (
  <a href={href} className={cn("hover:text-[#06B6D4]", className)}>
    {children}
  </a>
);

export const BreadcrumbSeparator = ({
  children = "/",
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => <span className={cn("px-1 text-gray-400", className)}>{children}</span>;
