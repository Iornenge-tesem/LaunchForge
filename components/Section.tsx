import { ReactNode } from "react";
import { Container } from "@/components/Container";

type SectionProps = {
  children: ReactNode;
  className?: string;
  narrow?: boolean;
};

export function Section({ children, className = "", narrow }: SectionProps) {
  return (
    <section className={`py-10 sm:py-14 ${className}`}>
      <Container narrow={narrow}>{children}</Container>
    </section>
  );
}
