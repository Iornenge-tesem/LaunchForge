import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  /** Use narrow max-width (forms, detail pages) */
  narrow?: boolean;
};

export function Container({ children, className = "", narrow }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-4 sm:px-6 ${narrow ? "max-w-3xl" : "max-w-6xl"} ${className}`}
    >
      {children}
    </div>
  );
}
