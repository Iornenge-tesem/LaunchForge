export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        textAlign: "center",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
          fontSize: 28,
        }}
      >
        🚀
      </div>

      {/* Header */}
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          letterSpacing: "-0.02em",
          marginBottom: 12,
        }}
      >
        LaunchForge
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontSize: 16,
          color: "var(--muted)",
          maxWidth: 280,
          lineHeight: 1.5,
          marginBottom: 40,
        }}
      >
        The launchpad for serious builders.
      </p>

      {/* Buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: "100%",
          maxWidth: 320,
        }}
      >
        <button
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: 16,
            fontWeight: 600,
            color: "#fff",
            background: "var(--primary)",
            border: "none",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Launch Project
        </button>

        <button
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: 16,
            fontWeight: 600,
            color: "var(--foreground)",
            background: "var(--card-bg)",
            border: "1px solid var(--card-border)",
            borderRadius: 12,
            cursor: "pointer",
          }}
        >
          Explore Projects
        </button>
      </div>

      {/* Footer */}
      <p
        style={{
          marginTop: 48,
          fontSize: 12,
          color: "var(--muted)",
          opacity: 0.6,
        }}
      >
        Built on Base
      </p>
    </main>
  );
}
