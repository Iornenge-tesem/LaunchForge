import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

/* ── Input ──────────────────────────────────────────────── */
type InputProps = {
  label: string;
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export function Input({
  label,
  hint,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--text-main)]">
        {label}
      </span>
      {hint && (
        <span className="mb-2 block text-xs text-[var(--text-dim)]">
          {hint}
        </span>
      )}
      <input
        className={`w-full rounded-[var(--radius-md)] border bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] ${
          error
            ? "border-[var(--red)]"
            : "border-[var(--border)] hover:border-[var(--border-hover)]"
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-[var(--red)]">{error}</span>
      )}
    </label>
  );
}

/* ── Textarea ───────────────────────────────────────────── */
type TextareaProps = {
  label: string;
  hint?: string;
  error?: string;
} & TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({
  label,
  hint,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--text-main)]">
        {label}
      </span>
      {hint && (
        <span className="mb-2 block text-xs text-[var(--text-dim)]">
          {hint}
        </span>
      )}
      <textarea
        className={`w-full rounded-[var(--radius-md)] border bg-[var(--bg-input)] px-4 py-3 text-sm leading-relaxed text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] ${
          error
            ? "border-[var(--red)]"
            : "border-[var(--border)] hover:border-[var(--border-hover)]"
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 block text-xs text-[var(--red)]">{error}</span>
      )}
    </label>
  );
}

/* ── Select ─────────────────────────────────────────────── */
type SelectProps = {
  label: string;
  options: { value: string; label: string }[];
  hint?: string;
  error?: string;
} & InputHTMLAttributes<HTMLSelectElement>;

export function Select({
  label,
  options,
  hint,
  error,
  className = "",
  ...props
}: SelectProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[var(--text-main)]">
        {label}
      </span>
      {hint && (
        <span className="mb-2 block text-xs text-[var(--text-dim)]">
          {hint}
        </span>
      )}
      <select
        className={`w-full appearance-none rounded-[var(--radius-md)] border bg-[var(--bg-input)] px-4 py-3 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)] ${
          error
            ? "border-[var(--red)]"
            : "border-[var(--border)] hover:border-[var(--border-hover)]"
        } ${className}`}
        {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
      >
        <option value="">Select…</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-1 block text-xs text-[var(--red)]">{error}</span>
      )}
    </label>
  );
}
