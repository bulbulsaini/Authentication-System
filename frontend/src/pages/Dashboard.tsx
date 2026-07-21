import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { theme } from "./authTheme";
import SalesChart from "./SalesChart";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // Firebase tells us the current user asynchronously, so we listen for it
    // instead of reading localStorage synchronously.
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate("/login");
        return;
      }
      setUser({
        name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
        email: firebaseUser.email || "",
      });
    });

    return unsubscribe;
  }, [navigate]);

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
        <h1 style={styles.title}>Welcome, {user?.name}</h1>
        <p style={styles.email}>{user?.email}</p>
        <p style={styles.msg}>You're signed in.</p>
        <button onClick={logout} style={styles.btn}>
          Log out
        </button>
      </div>

      <div style={styles.chartCard}>
        <SalesChart />
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
    padding: "40px 16px",
    background: theme.color.paper,
    fontFamily: theme.font.body,
  },
  card: {
    background: "#fff",
    borderRadius: theme.radius.lg,
    padding: "48px 44px",
    textAlign: "center",
    border: `1px solid ${theme.color.sand}`,
    boxShadow: "0 20px 50px rgba(45,27,61,0.08)",
    maxWidth: 380,
    width: "100%",
  },
  chartCard: {
    background: "#fff",
    borderRadius: theme.radius.lg,
    padding: "32px",
    border: `1px solid ${theme.color.sand}`,
    boxShadow: "0 20px 50px rgba(45,27,61,0.08)",
    maxWidth: 700,
    width: "100%",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    background: theme.color.terracotta,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 600,
    color: "#fff",
    margin: "0 auto 20px",
    fontFamily: theme.font.display,
  },
  title: {
    fontFamily: theme.font.display,
    fontSize: 26,
    fontWeight: 600,
    color: theme.color.charcoal,
    margin: 0,
  },
  email: {
    color: theme.color.charcoalSoft,
    marginTop: 6,
    fontSize: 14,
  },
  msg: {
    color: theme.color.charcoalSoft,
    marginTop: 14,
    fontSize: 14,
  },
  btn: {
    marginTop: 28,
    padding: "12px 32px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.color.sand}`,
    background: "#fff",
    color: theme.color.charcoal,
    fontSize: 15,
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: theme.font.body,
  },
};