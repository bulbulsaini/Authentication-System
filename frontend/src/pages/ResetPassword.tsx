import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell, Field, PrimaryButton, ErrorBanner } from "./AuthShell";
import { theme } from "./authTheme";

// IMPORTANT: Firebase's reset email links use a query param, e.g.
//   /reset-password?oobCode=ABC123
// not a path param like /reset-password/:token.
// Update the route in App.tsx from:
//   <Route path="/reset-password/:token" element={<ResetPassword />} />
// to:
//   <Route path="/reset-password" element={<ResetPassword />} />
//
// Also set this page's URL as the action URL in the Firebase console:
// Authentication > Templates > Password reset > edit (pencil icon) > customize action URL
// e.g. http://localhost:5173/reset-password (or your deployed domain)

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";
  const navigate = useNavigate();
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oobCode) {
      setError("This reset link is invalid or missing. Please request a new one.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Confirms the code is still valid (not expired/used) before applying it.
      await verifyPasswordResetCode(auth, oobCode);
      await confirmPasswordReset(auth, oobCode, form.password);
      navigate("/login");
    } catch (err: any) {
      setError(friendlyFirebaseError(err.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell step="reset">
      <h1 style={styles.title}>Choose a new password</h1>
      <p style={styles.subtitle}>Make it at least 6 characters.</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit}>
        <Field
          label="New password"
          name="password"
          type="password"
          placeholder="Min 6 characters"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Field
          label="Confirm new password"
          name="confirm"
          type="password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={handleChange}
          required
        />
        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Updating…" : "Update password"}
        </PrimaryButton>
      </form>

      <p style={styles.switch}>
        <Link to="/login" style={styles.link}>Back to log in</Link>
      </p>
    </AuthShell>
  );
}

// Maps Firebase's error codes to friendlier text for the error banner.
function friendlyFirebaseError(code: string): string {
  switch (code) {
    case "auth/expired-action-code":
      return "This reset link has expired. Please request a new one.";
    case "auth/invalid-action-code":
      return "This reset link is invalid or has already been used.";
    case "auth/weak-password":
      return "Password must be at least 6 characters.";
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