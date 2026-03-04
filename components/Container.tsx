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
      className={`mx-auto w-full px-5 sm:px-6 lg:px-8 ${
        narrow ? "max-w-[760px]" : "max-w-[1200px]"
      } ${className}`}
    >
      {children}
    </div>
  );
}
