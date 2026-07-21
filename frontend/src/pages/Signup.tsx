import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { AuthShell, Field, PrimaryButton, ErrorBanner } from "./AuthShell";
import { theme } from "./authTheme";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {  setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const credential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      // Firebase doesn't take a "name" field at signup, so we set it
      // separately on the user's profile right after account creation.
      await updateProfile(credential.user, { displayName: form.name });
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Signup error:", err.code, err.message); // TEMP: remove once fixed
      setError(`${friendlyFirebaseError(err.code)} (${err.code || "no code"})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell step="signup">
      <h1 style={styles.title}>Create your account</h1>
      <p style={styles.subtitle}>Takes less than a minute.</p>

      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit}>
        <Field
          label="Full name"
          name="name"
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          required
        />
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
          placeholder="Min 6 characters"
          value={form.password}
          onChange={handleChange}
          required
        />
        <Field
          label="Confirm password"
          name="confirm"
          type="password"
          placeholder="Repeat your password"
          value={form.confirm}
          onChange={handleChange}
          required
        />

        <PrimaryButton type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Create account"}
        </PrimaryButton>
      </form>

      <p style={styles.switch}>
        Already have an account? <Link to="/login" style={styles.link}>Log in</Link>
      </p>
    </AuthShell>
  );
}

// Maps Firebase's error codes to friendlier text for the error banner.
function friendlyFirebaseError(code: string): string {
  switch (code) {
    case "auth/email-already-in-use":
      return "An account with this email already exists.";
    case "auth/invalid-email":
      return "That email address looks invalid.";
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