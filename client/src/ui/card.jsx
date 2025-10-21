import { cn } from "./cn";
export function Card({className="", ...p}){ return <div className={cn("bg-white text-[#0A2540] rounded-xl border border-gray-200", className)} {...p}/>; }
export function CardHeader({className="", ...p}){ return <div className={cn("p-4", className)} {...p}/>; }
export function CardTitle({className="", ...p}){ return <h3 className={cn("text-lg font-semibold", className)} {...p}/>; }
export function CardContent({className="", ...p}){ return <div className={cn("p-4", className)} {...p}/>; }
