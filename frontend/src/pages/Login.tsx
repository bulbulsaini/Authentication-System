import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell, Field, PrimaryButton, ErrorBanner } from "./AuthShell";
import { theme } from "./authTheme";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      navigate("/dashboard");
    } catch (err: any) {
      setError(friendlyFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell step="login">
      <h1 style={styles.title}>Welcome back</h1>
      <p style={styles.subtitle}>Log in to pick up where you left off.</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit}>
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          required
        />

        <div style={styles.row}>
          <label style={styles.checkboxRow}>
            <input type="checkbox" style={styles.checkbox} />
            Remember for 30 days
          </label>
          <Link to="/forgot-password" style={styles.link}>
            Forgot password?
          </Link>
        </div>

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Logging in…" : "Log in"}
        </PrimaryButton>
      </form>

      <p style={styles.switch}>
        Don't have an account? <Link to="/signup" style={styles.link}>Sign up</Link>
      </p>
    </AuthShell>
  );
}

// Maps Firebase's error codes to friendlier text for the error banner.
function friendlyFirebaseError(code: string): string {
  switch (code) {
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait a moment and try again.";
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
  },
  row: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    fontSize: 14,
  },
  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: theme.color.charcoalSoft,
  },
  checkbox: {
    width: 16,
    height: 16,
    accentColor: theme.color.terracotta,
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