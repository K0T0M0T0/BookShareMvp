/* =========================
File: src/pages/auth/LoginPage.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/Slices/sessionSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import styles from "./auth.module.css";
import { adminAuthService } from "../../features/admin/services/adminAuthService";
import { loginUser } from "../../api/usersApi";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const u = await loginUser(email, password);

      if (u.banned) {
        setError("This account is banned.");
        setLoading(false);
        return;
      }

      // ✅ Update Redux session
      dispatch(login({ userId: u.id }));

      // ✅ Admin check
      if (u.isAdmin) {
        localStorage.setItem("isAdmin", "true");
        localStorage.setItem("adminId", u.id);
        console.log("✅ Logged in as admin");
      } else {
        localStorage.removeItem("isAdmin");
        localStorage.removeItem("adminId");
        console.log("👤 Logged in as regular user");
      }

      navigate("/"); // redirect to home or wherever you like
    } catch (err: any) {
      setError(err.message || "Invalid credentials");
      setLoading(false);
    }
  };

  return (
    <form className={styles.loginform} onSubmit={submit}>
      {error && <p className={styles.error}>{error}</p>}
      <h3>Login</h3>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Logging in..." : "Login"}
      </button>
      <button type="button" onClick={() => navigate("/register")}>
        Register
      </button>
    </form>
  );
}
