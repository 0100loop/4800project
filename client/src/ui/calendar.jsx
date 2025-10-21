import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";
import "react-day-picker/dist/style.css";

export function Calendar({ className, classNames, showOutsideDays=true, ...props }){
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-white rounded-xl border", className)}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center items-center relative w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(buttonVariants({ variant:"outline", size:"icon" }), "size-7 p-0 opacity-70 hover:opacity-100"),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell: "text-gray-500 rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn("p-0 text-center text-sm"),
        day: cn(buttonVariants({ variant:"ghost" }), "size-8 p-0 font-normal"),
        day_selected: "bg-[#06B6D4] text-white hover:bg-[#06B6D4]",
        day_today: "bg-gray-100",
        day_outside: "text-gray-400",
        day_disabled: "opacity-50",
        ...classNames,
      }}
      components={{
        IconLeft: (p)=> <ChevronLeft className={cn("size-4", p.className)} {...p}/>,
        IconRight:(p)=> <ChevronRight className={cn("size-4", p.className)} {...p}/>,
      }}
      {...props}
    />
  );
}
