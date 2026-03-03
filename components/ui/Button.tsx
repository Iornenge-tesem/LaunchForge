import { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantMap: Record<ButtonVariant, string> = {
  primary:
    "bg-[linear-gradient(135deg,var(--forge-primary),var(--forge-electric))] text-[var(--text-main)] shadow-[0_0_0_1px_rgba(59,130,246,0.28),0_0_28px_rgba(37,99,255,0.25)] hover:shadow-[0_0_0_1px_rgba(59,130,246,0.5),0_0_34px_rgba(59,130,246,0.35)]",
  secondary:
    "bg-[var(--bg-soft)] text-[var(--text-main)] border border-[rgba(148,163,184,0.24)] hover:border-[rgba(148,163,184,0.4)] hover:shadow-[0_0_20px_rgba(124,58,237,0.2)]",
  ghost:
    "bg-transparent text-[var(--text-dim)] border border-transparent hover:text-[var(--text-main)] hover:border-[rgba(148,163,184,0.24)]",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-12 w-full items-center justify-center rounded-[14px] px-6 text-base font-semibold tracking-[-0.01em] transition-all duration-200 ease-out sm:w-auto ${variantMap[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
