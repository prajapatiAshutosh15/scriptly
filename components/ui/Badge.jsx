import { cn } from "@/lib/utils";

export default function Badge({ children, color, className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors cursor-pointer",
        "bg-gray-100 text-gray-700 hover:bg-gray-200",
        "dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600",
        className
      )}
      style={color ? { backgroundColor: `${color}20`, color: color } : undefined}
      {...props}
    >
      {children}
    </span>
  );
}
