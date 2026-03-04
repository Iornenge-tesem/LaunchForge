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
    "bg-[var(--bg-elevated)] text-[var(--text-dim)] border-[var(--border)]",
  success:
    "bg-[var(--green-muted)] text-[var(--green)] border-[var(--green-muted)]",
  warning:
    "bg-[var(--amber-muted)] text-[var(--amber)] border-[var(--amber-muted)]",
  danger:
    "bg-[var(--red-muted)] text-[var(--red)] border-[var(--red-muted)]",
  info: "bg-[var(--accent-muted)] text-[var(--accent)] border-[var(--accent-muted)]",
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
