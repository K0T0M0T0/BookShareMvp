/* =========================
File: src/pages/auth/RegisterPage.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { register as regAction } from "../../store/Slices/usersSlice";
import { login } from "../../store/Slices/sessionSlice";
import type { AppDispatch } from "../../store/store";
import styles from "./auth.module.css";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(regAction({ username, email, password }));
    // auto login newest user
    const users = JSON.parse(localStorage.getItem("mvp_users") || "[]");
    const u = users.find((x: any) => x.email === email);
    if (u) dispatch(login({ userId: u.id }));
  };

  return (
    <form className={styles.form} onSubmit={submit}>
      <h3>Register</h3>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
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
      <button>Create account</button>
    </form>
  );
}
