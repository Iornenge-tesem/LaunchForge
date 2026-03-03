import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";

const fields = [
  { label: "Project Name", name: "projectName", type: "text", placeholder: "ForgePay" },
  { label: "Website", name: "website", type: "url", placeholder: "https://" },
  { label: "Twitter", name: "twitter", type: "text", placeholder: "@yourproject" },
  { label: "Token Symbol", name: "tokenSymbol", type: "text", placeholder: "FGP" },
  { label: "Category", name: "category", type: "text", placeholder: "defi" },
];

export default function LaunchPage() {
  return (
    <Section>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-[-0.02em] text-[var(--text-main)]">Create a Project</h1>
        <p className="mt-2 text-sm text-[var(--text-dim)]">Set up your launch details. Submission logic will be connected next.</p>

        <form className="mt-8 space-y-4 rounded-2xl border border-[rgba(148,163,184,0.2)] bg-[var(--bg-soft)] p-5 sm:p-6">
          {fields.map((field) => (
            <label key={field.name} className="block">
              <span className="mb-2 block text-sm text-[var(--text-main)]">{field.label}</span>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-[rgba(148,163,184,0.24)] bg-[rgba(7,11,20,0.8)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[var(--forge-electric)]"
              />
            </label>
          ))}

          <label className="block">
            <span className="mb-2 block text-sm text-[var(--text-main)]">Description</span>
            <textarea
              name="description"
              rows={4}
              placeholder="Describe your project"
              className="w-full rounded-xl border border-[rgba(148,163,184,0.24)] bg-[rgba(7,11,20,0.8)] px-4 py-3 text-sm text-[var(--text-main)] outline-none transition-colors placeholder:text-[var(--text-dim)] focus:border-[var(--forge-electric)]"
            />
          </label>

          <div className="pt-2">
            <Button variant="primary" type="submit">
              Submit Project
            </Button>
          </div>
        </form>
      </div>
    </Section>
  );
}
