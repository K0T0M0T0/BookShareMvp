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
  const [error, setError] = useState<string | null>(null);

  /* =========================
     Validate email format
  ========================= */
  const isValidEmail = (email: string) => {
    // Simple but reliable regex for email structure
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return pattern.test(email.trim());
  };

  /* =========================
     Handle form submission
  ========================= */
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Load existing users
    const users = JSON.parse(localStorage.getItem("mvp_users") || "[]");

    // 1️⃣ Check if any field empty
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }

    // 2️⃣ Check if email format valid
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // 3️⃣ Check if email already exists
    const existingUser = users.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (existingUser) {
      setError(
        "This email is already in use. Please log in or use another email."
      );
      return;
    }

    // 4️⃣ Register user
    dispatch(regAction({ username, email, password }));

    // 5️⃣ Auto login newest user
    const updatedUsers = JSON.parse(localStorage.getItem("mvp_users") || "[]");
    const newUser = updatedUsers.find(
      (u: any) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (newUser) dispatch(login({ userId: newUser.id }));
  };

  /* =========================
     UI Layout
  ========================= */
  return (
    <form className={styles.loginform} onSubmit={submit}>
      <h3>Register</h3>

      {error && <p className={styles.error}>{error}</p>}

      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="email"
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

      <button type="submit">Create account</button>
    </form>
  );
}
