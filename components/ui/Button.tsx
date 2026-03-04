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
    "bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)]",
  secondary:
    "bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] shadow-[var(--shadow-xs)]",
  ghost:
    "bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--bg-elevated)]",
  danger:
    "bg-[var(--red-muted)] text-[var(--red)] border border-transparent hover:border-[var(--red)]",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5 rounded-[5px]",
  md: "h-[44px] px-5 text-sm font-medium gap-2 rounded-[5px]",
  lg: "h-[48px] px-6 text-base font-semibold gap-2 rounded-[5px]",
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
