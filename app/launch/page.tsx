"use client";

import { useMemo, useState } from "react";
import { Section } from "@/components/Section";
import { Button } from "@/components/ui/Button";
import { Input, Textarea, Select } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { FundButton, getOnrampBuyUrl } from "@coinbase/onchainkit/fund";
import { CATEGORY_LABELS } from "@/lib/constants";
import { useMiniAppProfile } from "@/components/providers";
import { Check, Rocket, ArrowRight, AlertCircle } from "lucide-react";

type FormState = "idle" | "submitting" | "success";

const categoryOptions = Object.entries(CATEGORY_LABELS).map(
  ([value, label]) => ({
    value,
    label,
  })
);

export default function LaunchPage() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [imageMode, setImageMode] = useState<"url" | "upload">("url");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const {
    address,
    isConnected,
    user,
    notificationsEnabled,
    promptAddMiniApp,
  } = useMiniAppProfile();
  const cdpProjectId = process.env.NEXT_PUBLIC_CDP_PROJECT_ID;

  const fundingUrl = useMemo(() => {
    if (!cdpProjectId || !address) return null;

    return getOnrampBuyUrl({
      projectId: cdpProjectId,
      addresses: { [address]: ["base"] },
      assets: ["USDC"],
      defaultAsset: "USDC",
      defaultNetwork: "base",
      presetFiatAmount: 25,
      fiatCurrency: "USD",
    });
  }, [cdpProjectId, address]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    setFormState("submitting");

    const data = new FormData(e.currentTarget);

    let logoUrl: string | undefined;

    if (imageMode === "url") {
      logoUrl = ((data.get("logoUrl") as string) || "").trim() || undefined;
    } else {
      const uploadFile = data.get("logoFile");
      if (!(uploadFile instanceof File) || uploadFile.size === 0) {
        setErrorMsg("Please select an image to upload.");
        setFormState("idle");
        return;
      }

      const uploadForm = new FormData();
      uploadForm.set("file", uploadFile);

      const uploadRes = await fetch("/api/uploads/project-image", {
        method: "POST",
        body: uploadForm,
      });
      const uploadJson = await uploadRes.json();

      if (!uploadRes.ok || !uploadJson.ok || !uploadJson.url) {
        throw new Error(uploadJson.error ?? "Image upload failed");
      }

      logoUrl = uploadJson.url;
    }

    const body = {
      name: data.get("name") as string,
      description: data.get("description") as string,
      logoUrl,
      tokenSymbol: (data.get("tokenSymbol") as string) || undefined,
      category: (data.get("category") as string) || "other",
      website: (data.get("website") as string) || undefined,
      twitter: (data.get("twitter") as string) || undefined,
      github: (data.get("github") as string) || undefined,
      fundingTarget: data.get("fundingTarget")
        ? Number(data.get("fundingTarget"))
        : undefined,
      creatorWallet: address ?? "anonymous",
      creatorUsername: user?.username,
      creatorDisplayName: user?.displayName,
      creatorPfpUrl: user?.pfpUrl,
    };

    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();

      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? "Submission failed");
      }

      setFormState("success");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Something went wrong"
      );
      setFormState("idle");
    }
  }

  if (formState === "success") {
    return (
      <Section narrow>
        <Card padding="lg" className="mx-auto max-w-lg text-center fade-in-up">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--green-muted)]">
            <Check size={32} className="text-[var(--green)]" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)]">
            Project Submitted!
          </h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">
            Your project is being reviewed. AI analysis will begin shortly.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button
              variant="secondary"
              size="md"
              onClick={() => setFormState("idle")}
            >
              Submit Another
            </Button>
            <a href="/explore">
              <Button size="md" className="gap-2">
                Explore Projects
                <ArrowRight size={15} />
              </Button>
            </a>
          </div>
          {!notificationsEnabled && (
            <div className="mt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={promptAddMiniApp}
                className="border border-[var(--border)]"
              >
                Save LaunchForge for updates
              </Button>
            </div>
          )}
        </Card>
      </Section>
    );
  }

  return (
    <Section narrow>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent-muted)] text-[var(--accent)]">
            <Rocket size={20} />
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-main)] sm:text-3xl">
            Launch a Project
          </h1>
        </div>
        <p className="mt-2 text-sm text-[var(--text-secondary)] sm:text-base">
          Fill in your project details to get listed on LaunchForge.
        </p>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-[var(--red-border,rgba(248,113,113,0.3))] bg-[var(--red-muted)] px-4 py-3 text-sm text-[var(--red)]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Wallet status */}
      {!isConnected && (
        <div className="mb-7 flex items-start gap-3 rounded-xl border border-[var(--accent-border,rgba(77,163,255,0.3))] bg-[var(--accent-muted)] px-4 py-3 text-sm text-[var(--accent)]">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>Your wallet is connecting automatically. Your address will be saved once connected.</span>
        </div>
      )}

      <Card padding="md" className="mb-8 border-[var(--accent-border-soft)]/40">
        <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--bg-elevated)] p-4 sm:p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--text-main)]">Need USDC on Base to launch?</p>
              <p className="mt-1 text-sm text-[var(--text-secondary)]">
                Use Base funding tools, then return to submit and launch.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {fundingUrl ? (
                <FundButton
                  fundingUrl={fundingUrl}
                  text="Fund Wallet"
                  openIn="popup"
                  popupSize="md"
                  className="!min-h-[44px] !rounded-xl !bg-[var(--accent)] !px-4 !font-semibold !text-white"
                />
              ) : (
                <Button
                  type="button"
                  size="md"
                  disabled
                  className="min-h-[44px] px-4"
                >
                  Connect wallet to fund
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <Card padding="lg">
          <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--bg-elevated)] p-4 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">1</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Basic Info
              </h2>
            </div>
            <div className="space-y-6">
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
              <div>
                <p className="mb-2 text-sm font-medium text-[var(--text-main)]">
                  Project Image Source
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setImageMode("url")}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      imageMode === "url"
                        ? "border-[var(--accent-border-soft)] bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    Use URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageMode("upload")}
                    className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-all ${
                      imageMode === "upload"
                        ? "border-[var(--accent-border-soft)] bg-[var(--accent-muted)] text-[var(--accent)]"
                        : "border-[var(--border)] text-[var(--text-dim)] hover:border-[var(--border-hover)]"
                    }`}
                  >
                    Upload Image
                  </button>
                </div>
              </div>
              {imageMode === "url" ? (
                <Input
                  label="Project Image URL"
                  name="logoUrl"
                  type="url"
                  placeholder="https://.../project-logo.png"
                  hint="Paste an image URL"
                />
              ) : (
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-[var(--text-secondary)]">
                    Upload Project Image
                  </label>
                  <input
                    type="file"
                    name="logoFile"
                    accept="image/*"
                    className="h-[44px] w-full cursor-pointer rounded-xl border border-[var(--input-border)] bg-[var(--bg-elevated)] px-3 text-sm text-[var(--text-main)] file:mr-3 file:rounded-lg file:border-0 file:bg-[var(--accent-muted)] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[var(--accent)]"
                  />
                  <p className="mt-1 text-xs text-[var(--text-dim)]">
                    Max file size: 5MB (jpg, png, webp, gif)
                  </p>
                </div>
              )}
              <div className="grid gap-6 sm:grid-cols-2">
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
        </Card>

        {/* Links */}
        <Card padding="lg">
          <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--bg-elevated)] p-4 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">2</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Links
              </h2>
            </div>
            <div className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
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
        </Card>

        {/* Funding */}
        <Card padding="lg">
          <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--bg-elevated)] p-4 sm:p-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent)] text-xs font-bold text-white">3</span>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--text-dim)]">
                Funding & Tokenomics
              </h2>
            </div>
            <div className="space-y-6">
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
        </Card>

        {/* Submit */}
        <Card padding="lg">
          <div className="rounded-2xl border border-[var(--border)]/80 bg-[var(--bg-elevated)] p-4 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-[var(--text-dim)]">
                  By submitting, you accept the LaunchForge terms.
                </p>
                {address && (
                  <p className="mt-1 text-[11px] text-[var(--text-dim)]">
                    Submitting as{" "}
                    <span className="font-mono text-[var(--text-secondary)]">{address.slice(0, 6)}&hellip;{address.slice(-4)}</span>
                  </p>
                )}
              </div>
              <Button
                type="submit"
                size="lg"
                fullWidth
                className="sm:w-auto gap-2 border border-[var(--accent-border-soft)]"
                disabled={formState === "submitting"}
              >
                {formState === "submitting" ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Submitting…
                  </span>
                ) : (
                  <>
                    <Rocket size={16} />
                    Submit Project
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </form>
    </Section>
  );
}
