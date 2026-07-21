import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactElement, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgetPassword";
import ResetPassword from "./pages/ResetPassword";

// Guard: redirect to /login if Firebase has no signed-in user.
// Firebase reports auth state asynchronously, so we wait for the first
// callback before deciding anything — otherwise a logged-in user gets
// bounced to /login for a split second on every page load/refresh.
const PrivateRoute = ({ children }: { children: ReactElement }) => {
  const [checking, setChecking] = useState(true);
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthed(!!user);
      setChecking(false);
    });
    return unsubscribe;
  }, []);

  if (checking) return null; // could swap in a spinner here
  return isAuthed ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                element={<Navigate to="/login" />} />
        <Route path="/login"           element={<Login />} />
        <Route path="/signup"          element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Firebase reset links use ?oobCode=... as a query param, not a :token path param */}
        <Route path="/reset-password"  element={<ResetPassword />} />
        <Route path="/dashboard"       element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}