import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./AdminNavbar.module.scss";

export default function AdminZoneNav() {
  return (
    <div>
      <nav className={styles.navbar}>
        <NavLink
          to="/admin/users"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Users
        </NavLink>
        <NavLink
          to="/admin/logs"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Logs
        </NavLink>
        <NavLink
          to="/admin/requests"
          className={({ isActive }) => (isActive ? styles.active : "")}
        >
          Requests
        </NavLink>
      </nav>

      {/* This renders the selected admin page */}
      <Outlet />
    </div>
  );
}
