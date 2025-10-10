/* =========================
File: src/components/layout/AppShell.tsx
========================= */
import React from "react";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./MainNavbar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { logout } from "../store/Slices/sessionSlice";

interface typeNavBut {
  text: string;
  path: string;
}
// navbarcontainer: header with nav, theme toggle, and common layout. dir="rtl" for full RTL.
export const MainNavbar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = React.useState<"light" | "dark">(
    () => (localStorage.getItem("mvp_theme") as any) || "light"
  );
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navagtionbuttons: typeNavBut[] = [
    { text: "Create Book", path: "/books/create" },
    { text: "Search", path: "/search" },
    { text: "profile", path: "/profile" },
  ];
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvp_theme", theme);
  }, [theme]);

  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div className={styles.shell}>
      {
        //navbar header
      }
      <header className={styles.header}>
        <button
          className={`${styles.btn} ${styles.leftSection}`}
          onClick={() => navigate("/")}
        >
          Books C&R
        </button>

        <nav className={styles.middleSection}>
          {navagtionbuttons.map((btn) => (
            <button
              onClick={() => navigate(btn.path)}
              className={`${styles.NavbarBtn} ${styles.btn}`}
            >
              {" "}
              {btn.text}{" "}
            </button>
          ))}
        </nav>

        <div className={styles.rightSection}>
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
            <button className={styles.btn} onClick={() => navigate("/login")}>
              <CircleUserRound size={"35px"} />
            </button>
          )}
        </div>
      </header>
      {
        //main body
      }
      <main className={styles.main}>{children}</main>
    </div>
  );
};
