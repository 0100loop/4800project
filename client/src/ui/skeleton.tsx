import * as React from "react";
import { cn } from "../lib/utils";

export const Skeleton = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse bg-gray-200 rounded-md", className)} />
);
