"use client";

import { useState } from "react";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { CATEGORY_LABELS, PAYMENT } from "@/lib/constants";

type FormState = "idle" | "submitting" | "success";

const categoryOptions = Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export default function LaunchPage() {
  const [formState, setFormState] = useState<FormState>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    // TODO: connect to /api/projects/create with x402 payment
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setFormState("success");
  }

  if (formState === "success") {
    return (
      <Section narrow>
        <Card padding="lg" className="text-center fade-in-up">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--green-muted)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[var(--text-main)]">
            Project Submitted!
          </h1>
          <p className="mt-2 text-sm text-[var(--text-dim)]">
            Your project is being reviewed. AI analysis will begin shortly.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setFormState("idle")}
            >
              Submit Another
            </Button>
            <a href="/explore">
              <Button size="sm">Explore Projects</Button>
            </a>
          </div>
        </Card>
      </Section>
    );
  }

  return (
    <Section narrow>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
          Launch a Project
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text-dim)]">
          Fill in your project details to get listed. Submission costs{" "}
          <span className="font-medium text-[var(--accent)]">
            ${PAYMENT.PROJECT_CREATE} USDC
          </span>{" "}
          via x402.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card padding="lg">
          <div className="space-y-5">
            {/* Basic Info */}
            <div className="border-b border-[var(--border)] pb-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Basic Info
              </h2>
              <div className="space-y-4">
                <Input
                  label="Project Name"
                  name="name"
                  placeholder="e.g. ForgePay"
                  required
                />
                <Textarea
                  label="Description"
                  name="description"
                  rows={4}
                  placeholder="Describe what your project does, the problem it solves, and why it matters."
                  required
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Token Symbol"
                    name="tokenSymbol"
                    placeholder="e.g. FGP"
                    hint="Optional — leave blank if no token"
                  />
                  <Select
                    label="Category"
                    name="category"
                    options={categoryOptions}
                  />
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="border-b border-[var(--border)] pb-5">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Links
              </h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Website"
                    name="website"
                    type="url"
                    placeholder="https://yourproject.xyz"
                  />
                  <Input
                    label="Twitter / X"
                    name="twitter"
                    placeholder="@yourproject"
                  />
                </div>
                <Input
                  label="GitHub"
                  name="github"
                  type="url"
                  placeholder="https://github.com/your-org"
                  hint="Optional — open source projects get higher trust scores"
                />
              </div>
            </div>

            {/* Funding */}
            <div className="pb-2">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Funding & Tokenomics
              </h2>
              <div className="space-y-4">
                <Input
                  label="Funding Target (USDC)"
                  name="fundingTarget"
                  type="number"
                  placeholder="50000"
                  hint="Optional — set 0 or leave blank for no fundraise"
                  min={0}
                />
                <Textarea
                  label="Tokenomics"
                  name="tokenomics"
                  rows={3}
                  placeholder="Describe token distribution, vesting schedules, liquidity allocation…"
                  hint="Optional — helps with AI scoring"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-6 flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[var(--text-dim)]">
              By submitting, you agree to pay ${PAYMENT.PROJECT_CREATE} USDC
              and accept the LaunchForge terms.
            </p>
            <Button
              type="submit"
              size="lg"
              fullWidth
              className="sm:w-auto"
              disabled={formState === "submitting"}
            >
              {formState === "submitting" ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0F0F0F] border-t-transparent" />
                  Submitting…
                </span>
              ) : (
                "Submit Project"
              )}
            </Button>
          </div>
        </Card>
      </form>
    </Section>
  );
}
