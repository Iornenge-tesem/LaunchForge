import Link from "next/link";

type ProjectCardProps = {
  id: string;
  name: string;
  description: string;
  creator: string;
  status: "Live" | "Upcoming" | "Draft";
};

const statusClassMap: Record<ProjectCardProps["status"], string> = {
  Live: "bg-[rgba(37,99,255,0.18)] text-[var(--forge-electric)] border-[rgba(59,130,246,0.3)]",
  Upcoming: "bg-[rgba(124,58,237,0.15)] text-[#c4b5fd] border-[rgba(124,58,237,0.25)]",
  Draft: "bg-[rgba(148,163,184,0.12)] text-[var(--text-dim)] border-[rgba(148,163,184,0.2)]",
};

export function ProjectCard({ id, name, description, creator, status }: ProjectCardProps) {
  return (
    <Link
      href={`/project/${id}`}
      className="group rounded-2xl border border-[rgba(148,163,184,0.18)] bg-[var(--bg-soft)] p-5 transition-all duration-200 hover:border-[rgba(59,130,246,0.35)] hover:shadow-[0_0_20px_rgba(37,99,255,0.15)]"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold tracking-[-0.01em] text-[var(--text-main)]">{name}</h3>
        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${statusClassMap[status]}`}>{status}</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-[var(--text-dim)]">{description}</p>
      <p className="mt-4 text-xs text-[var(--text-dim)]">Creator: {creator}</p>
    </Link>
  );
}
