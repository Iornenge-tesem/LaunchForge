import { ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function Container({
  children,
  className = "",
  narrow,
}: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full px-6 sm:px-8 ${
        narrow ? "max-w-3xl" : "max-w-6xl"
      } ${className}`}
    >
      {children}
    </div>
  );
}
