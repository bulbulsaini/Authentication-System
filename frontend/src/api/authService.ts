// This file handles all communication with the backend API

const API_URL = "http://localhost:5000/api/auth";

// Helper to get the stored token from localStorage
export const getToken = (): string | null => localStorage.getItem("token");

// ─── SIGN UP ─────────────────────────────────────────────
export const signupAPI = async (name: string, email: string, password: string) => {
  const res = await fetch(`${API_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Signup failed");
  return data; // { token, user, message }
};

// ─── LOG IN ──────────────────────────────────────────────
export const loginAPI = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data; // { token, user, message }
};

// ─── FORGOT PASSWORD ─────────────────────────────────────
// Sends a request to email the user a reset link. The backend always
// responds with a generic success message, whether or not the email
// is registered, so there's nothing to branch on here besides network/
// server errors.
export const forgotPasswordAPI = async (email: string) => {
  const res = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data; // { message }
};

// ─── RESET PASSWORD ──────────────────────────────────────
// Takes the token from the reset link URL plus the new password.
export const resetPasswordAPI = async (token: string, password: string) => {
  const res = await fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Reset failed");
  return data; // { message }
};

// ─── GET PROFILE ─────────────────────────────────────────
export const getProfileAPI = async () => {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch profile");
  return data; // { user }
};