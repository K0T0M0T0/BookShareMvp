/* =========================
File: src/store/sessionSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// Tracks current logged-in user
interface SessionState {
  userId: string | null;
}
const initialState: SessionState = JSON.parse(
  localStorage.getItem("session") || '{"userId":null}'
);

const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ userId: string }>) => {
      state.userId = action.payload.userId;
      localStorage.setItem("session", JSON.stringify(state));
    },
    logout: (state) => {
      state.userId = null;
      localStorage.setItem("session", JSON.stringify(state));
    },
  },
});

export const { login, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
