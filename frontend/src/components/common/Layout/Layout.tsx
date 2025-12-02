/* ==========================================================
File: src/components/common/Layout/Layout.tsx
Purpose: Shared shell that renders the header, main content, and footer.
========================================================== */
import React from "react";
import styles from "./Layout.module.scss";
import Header from "./Header";
import Footer from "./Footer";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className={styles.shell}>
      <Header />
      <main className={styles.main}>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

