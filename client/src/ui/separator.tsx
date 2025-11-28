import * as React from "react";
import { cn } from "../lib/utils";

export const Separator = ({
  className,
}: {
  className?: string;
}) => (
  <div className={cn("w-full h-px bg-gray-200", className)} />
);

