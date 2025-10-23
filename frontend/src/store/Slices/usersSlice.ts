/* =========================
File: src/store/Slices/usersSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { addLog } from "./logsSlice"; // ✅ import logger

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  isAdmin?: boolean; // ✅ mark admins
  banned?: boolean; // ✅ mark banned users
}

const initial: User[] = JSON.parse(localStorage.getItem("mvp_users") || "[]");

const usersSlice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {
    /* ========================================================
       Register new user
       Defaults: not admin, not banned
    ======================================================== */
    register(state, action: PayloadAction<Omit<User, "id">>) {
      const user: User = {
        id: nanoid(),
        isAdmin: false,
        banned: false,
        ...action.payload,
      };
      state.push(user);
      localStorage.setItem("mvp_users", JSON.stringify(state));

      // ✅ Log registration
      setTimeout(() => {
        (window as any).store?.dispatch(
          addLog({
            type: "user",
            action: `Registered new user "${user.username}"`,
            userId: user.id,
            targetId: user.id,
            extra: `Email: ${user.email}`,
          })
        );
      });
    },

    /* ========================================================
       Update user profile
    ======================================================== */
    updateProfile(
      state,
      action: PayloadAction<{ id: string; data: Partial<User> }>
    ) {
      const u = state.find((x) => x.id === action.payload.id);
      if (u) Object.assign(u, action.payload.data);
      localStorage.setItem("mvp_users", JSON.stringify(state));

      // ✅ Log profile update
      if (u) {
        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "user",
              action: `Updated profile for "${u.username}"`,
              userId: u.id,
              targetId: u.id,
              extra: `Changed fields: ${Object.keys(action.payload.data).join(
                ", "
              )}`,
            })
          );
        });
      }
    },

    /* ========================================================
       Toggle ban/unban
    ======================================================== */
    toggleBan(state, action: PayloadAction<{ id: string; adminId?: string }>) {
      const u = state.find((x) => x.id === action.payload.id);
      if (u) u.banned = !u.banned;
      localStorage.setItem("mvp_users", JSON.stringify(state));

      // ✅ Log ban/unban
      if (u) {
        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "user",
              action: u.banned
                ? `Banned user "${u.username}"`
                : `Unbanned user "${u.username}"`,
              userId: action.payload.adminId || "admin",
              targetId: u.id,
              extra: `Email: ${u.email}`,
            })
          );
        });
      }
    },

    /* ========================================================
       Promote or demote admin
    ======================================================== */
    setAdmin(
      state,
      action: PayloadAction<{ id: string; value: boolean; adminId?: string }>
    ) {
      const u = state.find((x) => x.id === action.payload.id);
      if (u) u.isAdmin = action.payload.value;
      localStorage.setItem("mvp_users", JSON.stringify(state));

      // ✅ Log role change
      if (u) {
        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "user",
              action: action.payload.value
                ? `Promoted "${u.username}" to admin`
                : `Revoked admin from "${u.username}"`,
              userId: action.payload.adminId || "admin",
              targetId: u.id,
              extra: `Email: ${u.email}`,
            })
          );
        });
      }
    },
  },
});

export const { register, updateProfile, toggleBan, setAdmin } =
  usersSlice.actions;

export default usersSlice.reducer;
