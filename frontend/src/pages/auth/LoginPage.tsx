/* =========================
File: src/pages/auth/LoginPage.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/Slices/sessionSlice";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../store/store";
import styles from "./auth.module.css";
import { adminAuthService } from "../../features/admin/services/adminAuthService"; // ✅ import

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("mvp_users") || "[]");
    const u = users.find(
      (x: any) => x.email === email && x.password === password
    );

    if (!u) return alert("Invalid credentials");
    if (u.banned) return alert("This account is banned.");

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
  };

  return (
    <form className={styles.loginform} onSubmit={submit}>
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
      <button>Login</button>
      <button type="button" onClick={() => navigate("/register")}>
        Register
      </button>
    </form>
  );
}
