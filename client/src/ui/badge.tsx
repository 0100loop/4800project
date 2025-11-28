import { cn } from "../lib/utils";

export const Badge = ({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "outline";
  className?: string;
}) => {
  const variants = {
    default: "bg-[#06B6D4] text-white",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    outline: "border border-gray-400 text-gray-700 bg-white",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

