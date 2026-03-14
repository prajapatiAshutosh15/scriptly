import { cn } from "@/lib/utils";

const sizeMap = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-16 h-16",
  xl: "w-24 h-24",
};

export default function Avatar({ src, alt, size = "md", className }) {
  const initials = alt ? alt.split(" ").map(n => n[0]).join("").slice(0, 2) : "?";

  return (
    <div className={cn("relative rounded-full overflow-hidden bg-primary-light flex items-center justify-center", sizeMap[size], className)}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span className="text-white font-semibold text-sm">{initials}</span>
      )}
    </div>
  );
}
