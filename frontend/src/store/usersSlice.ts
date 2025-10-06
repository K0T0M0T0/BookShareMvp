/* =========================
File: src/store/usersSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

// Defines user type
export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
}

const initialState: User[] = JSON.parse(localStorage.getItem("users") || "[]");

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    register: (state, action: PayloadAction<Omit<User, "id">>) => {
      state.push({ id: nanoid(), ...action.payload });
      localStorage.setItem("users", JSON.stringify(state));
    },
  },
});

export const { register } = usersSlice.actions;
export default usersSlice.reducer;
