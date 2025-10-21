import { cn } from "./cn";
export function Input({className="", ...p}) {
  return <input className={cn("w-full rounded-lg border border-white/10 bg-white/5 text-white px-3 py-2", className)} {...p}/>;
}
