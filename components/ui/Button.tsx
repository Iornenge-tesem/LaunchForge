import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[#0F0F0F] font-semibold hover:bg-[var(--accent-hover)] shadow-[0_0_20px_var(--accent-glow)] hover:shadow-[0_0_28px_var(--accent-glow)]",
  secondary:
    "bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[rgba(176,176,176,0.06)]",
  danger:
    "bg-[var(--red-muted)] text-[var(--red)] border border-[rgba(248,113,113,0.18)] hover:bg-[rgba(248,113,113,0.18)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm rounded-[var(--radius-sm)]",
  md: "h-11 px-5 text-sm font-medium rounded-[var(--radius-md)]",
  lg: "h-12 px-6 text-base font-semibold rounded-[var(--radius-md)]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center transition-all duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${
        fullWidth ? "w-full" : ""
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
