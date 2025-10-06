/* =========================
File: src/components/layout/AppShell.tsx
========================= */
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AppShell.module.css";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store/store";
import { logout } from "../../store/Slices/sessionSlice";

// AppShell: header with nav, theme toggle, and common layout. dir="rtl" for full RTL.
export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = React.useState<"light" | "dark">(
    () => (localStorage.getItem("mvp_theme") as any) || "light"
  );
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvp_theme", theme);
  }, [theme]);

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.shell} dir="ltr">
      <header className={styles.header}>
        <div className={styles.brand}>
          <Link to="/">Books C&R</Link>
        </div>
        <nav className={styles.nav}>
          <Link to="/books">Books</Link>
          <Link to="/books/create">Create Book</Link>
          <Link to="/search">Search</Link>
          <Link to="/updates">Updates</Link>
          <Link to="/profile">Profile</Link>
        </nav>
        <div className={styles.actions}>
          <button
            className={styles.btn}
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            Toggle Theme
          </button>
          {session.userId ? (
            <button className={styles.btn} onClick={onLogout}>
              Logout
            </button>
          ) : (
            <Link className={styles.btn} to="/login">
              Login
            </Link>
          )}
        </div>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};
