/* =========================
File: src/store/Slice/usersSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
}
const initial: User[] = JSON.parse(localStorage.getItem("mvp_users") || "[]");

const usersSlice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {
    register(state, action: PayloadAction<Omit<User, "id">>) {
      state.push({ id: nanoid(), ...action.payload });
      localStorage.setItem("mvp_users", JSON.stringify(state));
    },
    updateProfile(
      state,
      action: PayloadAction<{ id: string; data: Partial<User> }>
    ) {
      const u = state.find((x) => x.id === action.payload.id);
      if (u) Object.assign(u, action.payload.data);
      localStorage.setItem("mvp_users", JSON.stringify(state));
    },
  },
});
export const { register, updateProfile } = usersSlice.actions;
export default usersSlice.reducer;
