import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "./utils";

export function Breadcrumb(props){ return <nav aria-label="breadcrumb" {...props}/>; }
export function BreadcrumbList({className,...p}){ return <ol className={cn("flex flex-wrap items-center gap-2 text-sm text-gray-500",className)} {...p}/>; }
export function BreadcrumbItem({className,...p}){ return <li className={cn("inline-flex items-center gap-1.5",className)} {...p}/>; }
export function BreadcrumbLink({asChild,className,...p}){ const Comp=asChild?Slot:"a"; return <Comp className={cn("hover:text-[#0A2540] transition-colors",className)} {...p}/>; }
export function BreadcrumbPage({className,...p}){ return <span role="link" aria-disabled="true" aria-current="page" className={cn("text-[#0A2540]",className)} {...p}/>; }
export function BreadcrumbSeparator({children,className,...p}){ return <li aria-hidden="true" className={cn("[&>svg]:size-3.5",className)} {...p}>{children ?? <ChevronRight/>}</li>; }
export function BreadcrumbEllipsis({className,...p}){ return <span aria-hidden="true" className={cn("flex size-9 items-center justify-center",className)} {...p}><MoreHorizontal className="size-4"/><span className="sr-only">More</span></span>; }
