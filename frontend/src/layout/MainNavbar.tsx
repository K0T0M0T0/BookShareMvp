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
import ProfileImage from "../components/ProfileImage"; // adjust the path to your component

interface typeNavBut {
  text: string;
  path: string;
}

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
  ];

  // Track scroll direction for navbar hide/show
  const [hidden, setHidden] = React.useState(false);
  const lastScrollY = React.useRef(0);

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      // ✅ Hide when scrolling down, show when scrolling up
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

  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("mvp_theme", theme);
  }, [theme]);

  // Logout (kept for future use if needed)
  const onLogout = () => {
    dispatch(logout());
    navigate("/");
  };

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

        {/* ===== Middle Section ===== */}
        <nav className={styles.middleSection}>
          {navagtionbuttons.map((btn) => (
            <button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className={`${styles.NavbarBtn} ${styles.btn}`}
            >
              {btn.text}
            </button>
          ))}
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

          {/* ✅ If user logged in → show profile image */}
          {session.userId ? (
            <button
              className={styles.btn}
              onClick={() => navigate("/profile")}
              aria-label="Profile"
              title="Profile"
            >
              <ProfileImage
                src={session.userProfileUrl} // or whatever field stores user image
                size={36}
                className={styles.profileImg}
              />
            </button>
          ) : (
            // Otherwise → show login icon
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
