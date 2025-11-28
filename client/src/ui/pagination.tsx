import * as React from "react";
import { cn } from "../lib/utils";
import { Button } from "./button";

export const Pagination = ({ children, className }: any) => (
  <nav className={cn("flex justify-center", className)}>{children}</nav>
);

export const PaginationList = ({ children, className }: any) => (
  <ul className={cn("flex items-center gap-2", className)}>{children}</ul>
);

export const PaginationItem = ({ children }: any) => <li>{children}</li>;

export const PaginationLink = ({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <Button
    size="sm"
    variant={active ? "default" : "outline"}
    onClick={onClick}
  >
    {children}
  </Button>
);
