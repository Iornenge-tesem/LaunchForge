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
      className={`mx-auto w-full px-6 sm:px-8 lg:px-10 ${
        narrow ? "max-w-[760px]" : "max-w-[1200px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
