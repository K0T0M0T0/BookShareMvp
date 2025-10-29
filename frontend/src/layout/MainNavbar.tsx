/* =========================
File: src/components/layout/AppShell.tsx
========================= */
import React from "react";
import { CircleUserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import styles from "./MainNavbar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
//import { logout } from "../store/Slices/sessionSlice";
//import { adminAuthService } from "../features/admin/services/adminAuthService";
import ProfileImage from "../components/ProfileImage"; // adjust path if needed

/*interface ProfileImageProps {
  src?: string | null;
  size?: number;
  className?: string;
}*/
interface NavButton {
  text: string;
  path: string;
}

export const MainNavbar: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // ===== Theme State =====
  const [theme, setTheme] = React.useState<"light" | "dark">(
    () => (localStorage.getItem("mvp_theme") as any) || "light"
  );

  // ===== Admin and Session =====

  const session = useSelector((s: RootState) => s.session);
  // const dispatch = useDispatch();
  const navigate = useNavigate();

  // ===== Navigation Buttons =====
  const navButtons: NavButton[] = [{ text: "Search", path: "/search" }];

  // ===== Scroll Hide/Show =====
  const [hidden, setHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      if (currentScroll > lastScrollY.current && currentScroll > 60) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScrollY.current = currentScroll;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ===== Apply Theme =====
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvp_theme", theme);
  }, [theme]);

  // ===== Logout =====
  /*  const onLogout = () => {
    dispatch(logout());
    adminAuthService.logout();
    navigate("/");
  };*/
  /*const [isAdmin, setIsAdmin] = React.useState(adminAuthService.isAdmin());
  console.log(isAdmin);

  React.useEffect(() => {
    const handleStorageChange = () => setIsAdmin(adminAuthService.isAdmin());
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
*/
  return (
    <div className={styles.shell}>
      {/* =========================
          Navbar Header
      ========================= */}
      <header className={`${styles.header} ${hidden ? styles.hidden : ""}`}>
        {/* ===== Left Section ===== */}
        <button
          className={`${styles.btn} ${styles.leftSection}`}
          onClick={() => navigate("/")}
        >
          Books C&R
        </button>
        {session.userId && (
          <button
            className={`${styles.NavbarBtn} ${styles.btn}`}
            onClick={() => navigate("/books/create")}
          >
            Create Book
          </button>
        )}
        {/* ===== Middle Section ===== */}
        <nav className={styles.middleSection}>
          {navButtons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className={`${styles.NavbarBtn} ${styles.btn}`}
            >
              {btn.text}
            </button>
          ))}

          {/* ✅ Show Admin Zone if logged in as admin */}
          {localStorage.getItem("isAdmin") && (
            <button
              className={`${styles.NavbarBtn} ${styles.btn}`}
              onClick={() => navigate("/admin")}
            >
              Admin Zone
            </button>
          )}
        </nav>

        {/* ===== Right Section ===== */}
        <div className={styles.rightSection}>
          {/* Theme toggle */}
          <button
            className={styles.btn}
            onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          >
            Toggle Theme
          </button>

          {/* ✅ Logged user → profile */}
          {session.userId ? (
            <div className={styles.userMenu}>
              <button
                className={styles.btn}
                onClick={() => navigate("/profile")}
                aria-label="Profile"
                title="Profile"
              >
                <ProfileImage />
              </button>
            </div>
          ) : (
            // ❌ Not logged in → show login icon
            <button
              className={styles.btn}
              onClick={() => navigate("/login")}
              aria-label="Login"
              title="Login"
            >
              <CircleUserRound size={35} />
            </button>
          )}
        </div>
      </header>

      {/* =========================
          Main Body
      ========================= */}
      <main className={styles.main}>{children}</main>
    </div>
  );
};
