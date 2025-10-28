/* ==========================================================
File: src/store/Slices/sessionSlice.ts
Purpose: Manage login/logout session state for the current user.
         This slice controls who is logged in, whether they're admin,
         and stores small user-related info for UI display.
========================================================== */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ==========================================================
SECTION 1: Data model for session state
========================================================== */
interface Session {
  userId: string | null; // ✅ who is logged in (null = no one)
  userName?: string | null; // optional display name
  isAdmin: boolean; // ✅ true = admin user, false = normal
  userProfileUrl?: string | null; // profile image (optional)
  token?: string | null; // 🔒 future use: backend JWT token
}

/* ==========================================================
SECTION 2: Initialize session from localStorage (if exists)
========================================================== */

// Try to load the last session from localStorage, or fallback to default empty state.
const savedSession = localStorage.getItem("mvp_session");

const initial: Session = savedSession
  ? JSON.parse(savedSession)
  : {
      userId: null,
      userName: null,
      isAdmin: false,
      userProfileUrl: null,
      token: null,
    };

/* ==========================================================
SECTION 3: Create Redux slice
========================================================== */

const sessionSlice = createSlice({
  name: "session",
  initialState: initial,
  reducers: {
    /* ========================================================
       ACTION: Login user
       Description:
         Called when the user successfully logs in.
         Stores their ID, name, admin flag, and optional token.
         Also saves session persistently in localStorage.
    ======================================================== */
    login(
      state,
      action: PayloadAction<{
        userId: string;
        userName?: string;
        isAdmin?: boolean;
        userProfileUrl?: string | null;
        token?: string | null;
      }>
    ) {
      // ✅ Update Redux state
      state.userId = action.payload.userId;
      state.userName = action.payload.userName || null;
      state.isAdmin = !!action.payload.isAdmin; // convert undefined → false
      state.userProfileUrl = action.payload.userProfileUrl || null;
      state.token = action.payload.token || null;

      // ✅ Save new session persistently so refresh doesn't log you out
      localStorage.setItem("mvp_session", JSON.stringify(state));
    },

    /* ========================================================
       ACTION: Logout user
       Description:
         Clears all session information when user logs out.
         Also removes session from localStorage.
    ======================================================== */
    logout(state) {
      // Clear all session data in Redux
      state.userId = null;
      state.userName = null;
      state.isAdmin = false;
      state.userProfileUrl = null;
      state.token = null;

      // Remove from localStorage so it doesn't auto-login next time
      localStorage.removeItem("mvp_session");
      localStorage.removeItem("isAdmin");
      localStorage.removeItem("adminId");
    },

    /* ========================================================
       ACTION: Update profile picture or name
       (optional helper for UI profile editing)
    ======================================================== */
    updateProfile(
      state,
      action: PayloadAction<{
        userName?: string;
        userProfileUrl?: string | null;
      }>
    ) {
      if (action.payload.userName) state.userName = action.payload.userName;
      if (action.payload.userProfileUrl)
        state.userProfileUrl = action.payload.userProfileUrl;

      // persist updates
      localStorage.setItem("mvp_session", JSON.stringify(state));
    },
  },
});

/* ==========================================================
SECTION 4: Export actions and reducer
========================================================== */
export const { login, logout, updateProfile } = sessionSlice.actions;
export default sessionSlice.reducer;
