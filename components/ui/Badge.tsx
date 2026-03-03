import { ReactNode } from "react";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info";

type BadgeProps = {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
};

const variantStyles: Record<BadgeVariant, string> = {
  default:
    "bg-[rgba(176,176,176,0.08)] text-[var(--text-dim)] border-[var(--border)]",
  success:
    "bg-[var(--green-muted)] text-[var(--green)] border-[rgba(52,211,153,0.2)]",
  warning:
    "bg-[var(--amber-muted)] text-[var(--amber)] border-[rgba(251,191,36,0.2)]",
  danger:
    "bg-[var(--red-muted)] text-[var(--red)] border-[rgba(248,113,113,0.2)]",
  info: "bg-[var(--accent-muted)] text-[var(--accent)] border-[rgba(77,163,255,0.2)]",
};

export function Badge({
  children,
  variant = "default",
  dot,
  className = "",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: "currentColor" }}
        />
      )}
      {children}
    </span>
  );
}
