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
      <span className="mb-2 block text-sm font-medium text-[var(--text-main)]">
        {label}
      </span>
      {hint && (
        <span className="-mt-1 mb-2 block text-xs text-[var(--text-dim)]">
          {hint}
        </span>
      )}
      <input
        className={`h-[44px] w-full rounded-xl border bg-[var(--bg-input)] px-4 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent-border-soft)] focus-visible:outline-none ${
          error
            ? "border-[var(--red-border-soft)]"
            : "border-[var(--input-border)] hover:border-[var(--border-hover)]"
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
        className={`min-h-[120px] w-full rounded-xl border bg-[var(--bg-input)] px-3.5 py-3 text-sm leading-relaxed text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all placeholder:text-[var(--text-dim)] focus:border-[var(--accent-border-soft)] focus-visible:outline-none ${
          error
            ? "border-[var(--red-border-soft)]"
            : "border-[var(--input-border)] hover:border-[var(--border-hover)]"
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
      <div className="relative">
        <select
          className={`h-[44px] w-full cursor-pointer appearance-none rounded-xl border bg-[var(--bg-input)] px-4 pr-10 text-sm text-[var(--text-main)] shadow-[var(--shadow-xs)] outline-none transition-all hover:bg-[var(--bg-elevated)] focus:border-[var(--accent-border-soft)] focus-visible:outline-none ${
            error
              ? "border-[var(--red-border-soft)]"
              : "border-[var(--input-border)] hover:border-[var(--border-hover)]"
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
        <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-dim)]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
      </div>
      {error && (
        <span className="mt-1 block text-xs text-[var(--red)]">{error}</span>
      )}
    </label>
  );
}
