import { ReactNode, useEffect } from "react";
import { theme } from "./authTheme";

// Inline styles can't express media queries, so the responsive collapse
// (stacking the photo panel below the form on narrow screens) lives in this
// small injected stylesheet. Injected once, reused by every auth page.
const RESPONSIVE_CSS = `
  @media (max-width: 860px) {
    .auth-page { flex-direction: column; }
    .auth-photo-panel { flex: 0 0 220px; align-items: center; justify-content: center; }
    .auth-photo-content { padding: 32px; text-align: center; }
    .auth-photo-line { font-size: 22px; }
    .auth-form-panel { flex: 1 1 auto; padding: 40px 24px; }
  }
  .auth-input:focus { border-color: ${theme.color.terracotta} !important; }
  .auth-btn:hover:not(:disabled) { background: ${theme.color.terracottaDeep} !important; }
`;

function useInjectedStyles() {
  useEffect(() => {
    if (document.getElementById("auth-shell-responsive")) return;
    const style = document.createElement("style");
    style.id = "auth-shell-responsive";
    style.textContent = RESPONSIVE_CSS;
    document.head.appendChild(style);
  }, []);
}

// Shared shell for every auth screen: white form panel on the left,
// warm illustrated/photo panel on the right.
// `step` drives the little terracotta progress thread + caption so the
// four auth pages (login / signup / forgot / reset) read as one flow.

type Step = "login" | "signup" | "forgot" | "reset";

const STEP_COPY: Record<Step, { eyebrow: string; line: string }> = {
  login:  { eyebrow: "01 — Welcome back",   line: "Pick up right where you left off." },
  signup: { eyebrow: "02 — Get started",    line: "A few details and you're in." },
  forgot: { eyebrow: "03 — Account recovery", line: "We'll send you a way back in." },
  reset:  { eyebrow: "04 — Almost there",   line: "Choose a new password to finish up." },
};

export function AuthShell({ step, children }: { step: Step; children: ReactNode }) {
  useInjectedStyles();
  const copy = STEP_COPY[step];

  return (
    <div className="auth-page" style={styles.page}>
      <div className="auth-form-panel" style={styles.formPanel}>
        <div style={styles.formInner}>{children}</div>
      </div>

      <div className="auth-photo-panel" style={styles.photoPanel}>
        <div style={styles.photoOverlay} />

        {/* Small mark, top-right — a quiet brand/theme touch, not a focal point */}
        <div style={styles.cornerMark}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="9" rx="2" stroke={theme.color.sand} strokeWidth="1.6" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={theme.color.sand} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </div>

        <div className="auth-photo-content" style={styles.photoContent}>
          <span style={styles.eyebrow}>{copy.eyebrow}</span>
          <p className="auth-photo-line" style={styles.photoLine}>{copy.line}</p>
        </div>
      </div>
    </div>
  );
}

// One small reusable piece: label + input, styled consistently everywhere.
export function Field({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label style={styles.fieldWrap}>
      <span style={styles.label}>{label}</span>
      <input className="auth-input" style={styles.input} {...props} />
    </label>
  );
}

export function PrimaryButton({
  children,
  ...props
}: { children: ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className="auth-btn"
      style={{ ...styles.btn, ...(props.disabled ? styles.btnDisabled : {}) }}
      {...props}
    >
      {children}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  if (!message) return null;
  return <div style={styles.error}>{message}</div>;
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    fontFamily: theme.font.body,
    background: theme.color.paper,
  },
  formPanel: {
    flex: "0 0 45%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "48px 24px",
  },
  formInner: {
    width: "100%",
    maxWidth: 380,
  },
  photoPanel: {
    flex: "1 1 55%",
    position: "relative",
    background:
      `radial-gradient(circle at 20% 20%, ${theme.color.terracotta} 0%, transparent 45%),` +
      `radial-gradient(circle at 80% 75%, ${theme.color.plumSoft} 0%, transparent 50%),` +
      `linear-gradient(160deg, ${theme.color.plum} 0%, #1A1020 100%)`,
    display: "flex",
    alignItems: "flex-end",
    overflow: "hidden",
  },
  photoOverlay: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(135deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 14px)",
  },
  photoContent: {
    position: "relative",
    padding: "56px",
    color: theme.color.paper,
  },
  cornerMark: {
    position: "absolute",
    top: 28,
    right: 32,
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: `1px solid rgba(232,223,211,0.35)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.04)",
  },
  eyebrow: {
    display: "inline-block",
    fontSize: 12,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: theme.color.sand,
    borderLeft: `2px solid ${theme.color.terracotta}`,
    paddingLeft: 10,
    marginBottom: 14,
  },
  photoLine: {
    fontFamily: theme.font.display,
    fontSize: 28,
    lineHeight: 1.3,
    maxWidth: 380,
    margin: 0,
  },
  fieldWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 6,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: theme.color.charcoal,
  },
  input: {
    padding: "12px 14px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.color.sand}`,
    background: "#fff",
    color: theme.color.charcoal,
    fontSize: 15,
    fontFamily: theme.font.body,
    outline: "none",
    transition: "border-color 0.15s ease",
  },
  btn: {
    width: "100%",
    marginTop: 8,
    padding: "13px",
    borderRadius: theme.radius.sm,
    border: "none",
    background: theme.color.terracotta,
    color: "#fff",
    fontSize: 15,
    fontWeight: 600,
    fontFamily: theme.font.body,
    cursor: "pointer",
    transition: "background 0.15s ease",
  },
  btnDisabled: {
    background: theme.color.sandDeep,
    cursor: "not-allowed",
  },
  error: {
    background: theme.color.errorBg,
    border: `1px solid ${theme.color.error}`,
    color: theme.color.error,
    padding: "10px 14px",
    borderRadius: theme.radius.sm,
    marginBottom: 16,
    fontSize: 14,
  },
};