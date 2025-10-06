/* =========================
File: src/pages/auth/LoginPage.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../store/Slices/sessionSlice";
import type { AppDispatch } from "../../store/store";
import styles from "./auth.module.css";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("mvp_users") || "[]");
    const u = users.find(
      (x: any) => x.email === email && x.password === password
    );
    if (!u) return alert("Invalid credentials");
    dispatch(login({ userId: u.id }));
  };

  return (
    <form className={styles.form} onSubmit={submit}>
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
    </form>
  );
}
