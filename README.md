# LaunchForge

A Base Mini App launchpad for real builders and experimental ideas.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) or test in [base.dev/preview](https://base.dev/preview).

## Structure

```
/app              → Next.js App Router pages & API routes
/components       → Reusable React components
/lib              → Shared utilities and helpers
/contracts        → Smart contract ABIs and addresses
/agents           → AI agent analysis modules
```

## Manifest

Farcaster manifest served at `/.well-known/farcaster.json`, configured via `minikit.config.ts`.
