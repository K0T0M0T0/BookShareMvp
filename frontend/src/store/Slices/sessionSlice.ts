/* ==========================================================
File: src/store/Slices/sessionSlice.ts
Purpose: Manage login/logout session state for the current user.
         Persists to localStorage so refresh doesn't log you out.
========================================================== */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "mvp_session";

/* ==========================================================
SECTION 1: Data model for session state
========================================================== */
export interface SessionState {
  userId: string | null;
  userName: string | null;
  isAdmin: boolean;
  userProfileUrl: string | null;
  token: string | null; // 🔒 JWT from backend
}

/* ==========================================================
SECTION 2: Initialize session from localStorage (if exists)
========================================================== */

const savedSessionRaw =
  typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;

const defaultSession: SessionState = {
  userId: null,
  userName: null,
  isAdmin: false,
  userProfileUrl: null,
  token: null,
};

const initial: SessionState = savedSessionRaw
  ? { ...defaultSession, ...JSON.parse(savedSessionRaw) }
  : defaultSession;

/* ==========================================================
SECTION 3: Slice
========================================================== */

const sessionSlice = createSlice({
  name: "session",
  initialState: initial,
  reducers: {
    /* ----------------------------------------------
       login
       Payload should come from your /api/users/login
       response: { user, token }
    ---------------------------------------------- */
    login(
      state,
      action: PayloadAction<{
        userId: string;
        userName?: string | null;
        isAdmin?: boolean;
        userProfileUrl?: string | null;
        token: string; // ⬅ required: backend JWT
      }>
    ) {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName ?? null;
      state.isAdmin = !!action.payload.isAdmin;
      state.userProfileUrl = action.payload.userProfileUrl ?? null;
      state.token = action.payload.token;

      // ✅ persist to localStorage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },

    /* ----------------------------------------------
       logout
    ---------------------------------------------- */
    logout(state) {
      state.userId = null;
      state.userName = null;
      state.isAdmin = false;
      state.userProfileUrl = null;
      state.token = null;

      localStorage.removeItem(STORAGE_KEY);
    },

    /* ----------------------------------------------
       updateProfile (optional)
    ---------------------------------------------- */
    updateProfile(
      state,
      action: PayloadAction<{
        userName?: string | null;
        userProfileUrl?: string | null;
      }>
    ) {
      if (typeof action.payload.userName !== "undefined") {
        state.userName = action.payload.userName;
      }
      if (typeof action.payload.userProfileUrl !== "undefined") {
        state.userProfileUrl = action.payload.userProfileUrl;
      }

      // re-save updated session
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    },
  },
});

/* ==========================================================
SECTION 4: Exports
========================================================== */

export const { login, logout, updateProfile } = sessionSlice.actions;
export default sessionSlice.reducer;
