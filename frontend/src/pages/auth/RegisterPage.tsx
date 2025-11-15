/* =========================
File: src/pages/auth/RegisterPage.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUserThunk } from "../../store/Slices/usersSlice";
import { login } from "../../store/Slices/sessionSlice";
import type { AppDispatch } from "../../store/store";
import styles from "./auth.module.css";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

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
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // 1️⃣ Check if any field empty
    if (!username || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }

    // 2️⃣ Check if email format valid
    if (!isValidEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      // 3️⃣ Register user
      const result = await dispatch(
        registerUserThunk({ username, email, password })
      ).unwrap();

      // 4️⃣ Auto login newest user
      if (result) {
        dispatch(login({ userId: result.id }));
        navigate("/");
      }
    } catch (err: any) {
      setError(err.message || "Failed to register. Email may already be in use.");
      setLoading(false);
    }
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

      <button type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
