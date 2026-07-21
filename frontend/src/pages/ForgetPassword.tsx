import { useState } from "react";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell, Field, PrimaryButton, ErrorBanner } from "./AuthShell";
import { theme } from "./authTheme";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      // Firebase emails the user a link containing an oobCode.
      // That link points wherever you configure it in the Firebase console
      // (Authentication > Templates > Password reset > action URL) —
      // by default it's a Firebase-hosted page, but you can point it at
      // your own /reset-password route. See the note below ResetPassword.tsx.
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err: any) {
      setError(friendlyFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell step="forgot">
      <h1 style={styles.title}>Reset your password</h1>
      <p style={styles.subtitle}>
        Enter your email and we'll send you a link to get back in.
      </p>

      <ErrorBanner message={error} />

      {sent ? (
        <div style={styles.confirmation}>
          Check <strong>{email}</strong> for a reset link. It expires in 1 hour.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <PrimaryButton type="submit" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </PrimaryButton>
        </form>
      )}

      <p style={styles.switch}>
        Remembered it? <Link to="/login" style={styles.link}>Back to log in</Link>
      </p>
    </AuthShell>
  );
}

// Maps Firebase's error codes to friendlier text for the error banner.
function friendlyFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-not-found":
      // Firebase intentionally doesn't reveal whether an email exists,
      // to avoid leaking which addresses are registered. Showing "sent"
      // either way (handled below) is the standard, safer approach.
      return "";
    default:
      return "Something went wrong. Please try again.";
  }
}

const styles: Record<string, React.CSSProperties> = {
  title: {
    fontFamily: theme.font.display,
    fontSize: 32,
    fontWeight: 600,
    color: theme.color.charcoal,
    margin: 0,
  },
  subtitle: {
    color: theme.color.charcoalSoft,
    marginTop: 6,
    marginBottom: 28,
    fontSize: 15,
    lineHeight: 1.5,
  },
  confirmation: {
    background: "#EEF3EC",
    border: `1px solid ${theme.color.success}`,
    color: theme.color.success,
    padding: "14px 16px",
    borderRadius: theme.radius.sm,
    fontSize: 14,
    lineHeight: 1.5,
  },
  link: {
    color: theme.color.terracotta,
    fontWeight: 600,
    textDecoration: "none",
  },
  switch: {
    textAlign: "center",
    color: theme.color.charcoalSoft,
    marginTop: 24,
    fontSize: 14,
  },
};