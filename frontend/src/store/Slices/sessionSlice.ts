/* =========================
File: src/store/sessionSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface Session {
  userId: string | null;
}
const initial: Session = JSON.parse(
  localStorage.getItem("mvp_session") || '{"userId":null}'
);

const sessionSlice = createSlice({
  name: "session",
  initialState: initial,
  reducers: {
    login(state, action: PayloadAction<{ userId: string }>) {
      state.userId = action.payload.userId;
      localStorage.setItem("mvp_session", JSON.stringify(state));
    },
    logout(state) {
      state.userId = null;
      localStorage.setItem("mvp_session", JSON.stringify(state));
    },
  },
});
export const { login, logout } = sessionSlice.actions;
export default sessionSlice.reducer;
