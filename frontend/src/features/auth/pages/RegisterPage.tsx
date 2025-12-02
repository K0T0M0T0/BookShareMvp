/* =========================
File: src/pages/auth/RegisterPage.tsx
========================= */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUserThunk } from "../../../store/Slices/usersSlice";
import { login } from "../../../store/Slices/sessionSlice";
import { useAppDispatch } from "../../../app/hooks";
import styles from "../../../styles/components/auth/AuthPage.module.scss";

// ✅ use same login API as LoginPage
import { loginUser as apiLoginUser } from "../../../api/authApi";

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
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
      // 3️⃣ Register user in backend
      await dispatch(registerUserThunk({ username, email, password })).unwrap();

      // 4️⃣ Immediately login using same credentials
      const loginData = await apiLoginUser(email, password);
      const user = loginData.user;

      // 5️⃣ Save full session (with token) → persists in localStorage
      dispatch(
        login({
          userId: user.id ?? user._id, // ✅ handle Mongo _id
          userName: user.username,
          isAdmin: user.isAdmin,
          userProfileUrl: user.avatar ?? null,
          token: loginData.token, // ✅ JWT
        })
      );

      navigate("/");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to register. Email may already be in use."
      );
    } finally {
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
