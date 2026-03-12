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
    "bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] shadow-[var(--primary-btn-shadow)] hover:shadow-[var(--primary-btn-shadow-hover)]",
  secondary:
    "bg-transparent text-[var(--text-main)] border border-[var(--input-border)] hover:border-[var(--border-hover)] hover:bg-[var(--accent-muted)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]",
  danger:
    "bg-[var(--red-muted)] text-[var(--red)] border border-transparent hover:border-[var(--red)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "min-h-[40px] px-5 text-sm gap-1.5 rounded-xl",
  md: "min-h-[48px] px-6 text-sm font-semibold gap-2 rounded-xl",
  lg: "min-h-[54px] px-8 text-base font-semibold gap-2.5 rounded-2xl",
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
      className={`inline-flex cursor-pointer items-center justify-center transition-all duration-200 ease-out active:scale-[0.97] disabled:pointer-events-none disabled:opacity-40 ${
        fullWidth ? "w-full" : ""
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
