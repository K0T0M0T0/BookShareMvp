/* ==========================================================
File: src/store/Slices/usersSlice.ts
Purpose: Manage user accounts (registration, admin, bans)
and log all important user-related actions.
========================================================== */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { addLog } from "./logsSlice"; // ✅ log slice for admin audit trail

/* ==========================================================
SECTION 1: User model definition
========================================================== */
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isAdmin?: boolean; // determines if user has admin privileges
  banned?: boolean; // determines if user is banned
}

/* ==========================================================
SECTION 2: Load saved users or empty array
========================================================== */
const initial: User[] = JSON.parse(localStorage.getItem("mvp_users") || "[]");

/* ==========================================================
SECTION 3: Slice setup
========================================================== */
const usersSlice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {
    /* ========================================================
       ACTION: Register new user
       - Default: not admin, not banned
    ======================================================== */
    register(
      state,
      action: PayloadAction<Omit<User, "id" | "isAdmin" | "banned">>
    ) {
      const user: User = {
        id: nanoid(),
        isAdmin: true, // ✅ enforce non-admin
        banned: false,
        ...action.payload,
      };

      state.push(user);
      localStorage.setItem("mvp_users", JSON.stringify(state));

      // ✅ Clone data before async call (to avoid proxy revoke)
      const logData = {
        id: user.id,
        username: user.username,
        email: user.email,
      };

      setTimeout(() => {
        (window as any).store?.dispatch(
          addLog({
            type: "user",
            action: `Registered new user "${logData.username}"`,
            userId: logData.id,
            targetId: logData.id,
            extra: `Email: ${logData.email}`,
          })
        );
      });
    },

    /* ========================================================
       ACTION: Update user profile
    ======================================================== */
    updateProfile(
      state,
      action: PayloadAction<{ id: string; data: Partial<User> }>
    ) {
      const u = state.find((x) => x.id === action.payload.id);
      if (u) Object.assign(u, action.payload.data);
      localStorage.setItem("mvp_users", JSON.stringify(state));

      if (u) {
        const logData = {
          id: u.id,
          username: u.username,
          changed: Object.keys(action.payload.data).join(", "),
        };

        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "user",
              action: `Updated profile for "${logData.username}"`,
              userId: logData.id,
              targetId: logData.id,
              extra: `Changed fields: ${logData.changed}`,
            })
          );
        });
      }
    },

    /* ========================================================
       ACTION: Toggle user ban/unban
    ======================================================== */
    toggleBan(state, action: PayloadAction<{ id: string; adminId?: string }>) {
      const u = state.find((x) => x.id === action.payload.id);
      if (!u) return;
      u.banned = !u.banned;
      localStorage.setItem("mvp_users", JSON.stringify(state));

      const logData = {
        id: u.id,
        username: u.username,
        email: u.email,
        banned: u.banned,
      };

      setTimeout(() => {
        (window as any).store?.dispatch(
          addLog({
            type: "user",
            action: logData.banned
              ? `Banned user "${logData.username}"`
              : `Unbanned user "${logData.username}"`,
            userId: action.payload.adminId || "admin",
            targetId: logData.id,
            extra: `Email: ${logData.email}`,
          })
        );
      });
    },

    /* ========================================================
       ACTION: Promote or revoke admin privileges
    ======================================================== */
    setAdmin(
      state,
      action: PayloadAction<{ id: string; value: boolean; adminId?: string }>
    ) {
      const u = state.find((x) => x.id === action.payload.id);
      if (!u) return;
      u.isAdmin = action.payload.value;
      localStorage.setItem("mvp_users", JSON.stringify(state));

      // ✅ clone before async dispatch
      const logData = {
        id: u.id,
        username: u.username,
        email: u.email,
        isAdmin: u.isAdmin,
      };

      setTimeout(() => {
        (window as any).store?.dispatch(
          addLog({
            type: "user",
            action: logData.isAdmin
              ? `Promoted "${logData.username}" to admin`
              : `Revoked admin from "${logData.username}"`,
            userId: action.payload.adminId || "admin",
            targetId: logData.id,
            extra: `Email: ${logData.email}`,
          })
        );
      });
    },
  },
});

/* ==========================================================
SECTION 4: Exports
========================================================== */
export const { register, updateProfile, toggleBan, setAdmin } =
  usersSlice.actions;

export default usersSlice.reducer;
