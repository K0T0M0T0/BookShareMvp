/* =========================
File: src/components/layout/AppShell.tsx
========================= */
import React from "react";
import { Link } from "react-router-dom";
import styles from "./AppShell.module.css";

// Provides top navigation bar + theme switcher + RTL
export const AppShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = React.useState<"light" | "dark">("light");
  return (
    <div className={styles.shell} dir="ltr" data-theme={theme}>
      <header className={styles.header}>
        <nav className={styles.nav}>
          <Link to="/">בית</Link>
          <Link to="/books">ספרים</Link>
          <Link to="/dashboard">לוח בקרה</Link>
        </nav>
        <button
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
        >
          change theme
        </button>
      </header>
      <main className={styles.main}>{children}</main>
    </div>
  );
};
