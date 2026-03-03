import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingStyles = {
  sm: "p-4",
  md: "p-5",
  lg: "p-6 sm:p-8",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--bg-card)] ${
        paddingStyles[padding]
      } ${
        hover
          ? "transition-all duration-200 hover:border-[var(--border-hover)] hover:bg-[var(--bg-elevated)] hover:shadow-[0_2px_24px_rgba(0,0,0,0.3)]"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
