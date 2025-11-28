/* =========================
File: src/pages/auth/LoginPage.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login as loginAction } from "../../store/Slices/sessionSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import styles from "./auth.module.css";

import { loginUser as apiLoginUser } from "../../api/usersApi";

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
      const data = await apiLoginUser(email, password);
      const user = data.user;
      // 🔥 Save into Redux session
      dispatch(
        loginAction({
          userId: user.id ?? user._id,
          userName: user.username,
          isAdmin: user.isAdmin,
          userProfileUrl: user.avatar ?? null, // if you have avatar
          token: data.token, // ✅ JWT from backend
        })
      );

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
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
