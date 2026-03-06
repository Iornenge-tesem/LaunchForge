import { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

const paddingStyles = {
  sm: "p-5",
  md: "p-6",
  lg: "p-6 sm:p-7",
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`rounded-[16px] border border-[var(--border)] bg-[var(--bg-card)] shadow-[var(--shadow-sm)] ${
        paddingStyles[padding]
      } ${
        hover
          ? "transition-all duration-200 hover:border-[var(--border-hover)] hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 cursor-pointer"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
