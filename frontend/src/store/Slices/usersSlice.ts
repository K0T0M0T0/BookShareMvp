/* ==========================================================
File: src/store/Slices/usersSlice.ts
Purpose: Manage user accounts (admin only)
========================================================== */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { addLog } from "./logsSlice";

import {
  fetchAllUsers,
  registerUser as registerUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "../../api/usersApi";

/* ==========================================================
SECTION 1: User model
========================================================== */
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  isAdmin?: boolean;
  banned?: boolean;
}

/* ==========================================================
SECTION 2: Initial state
========================================================== */
const initial: User[] = [];

/* ==========================================================
SECTION 3: Async Thunks (with JWT token)
========================================================== */

// Load all users (admin only)
export const loadUsers = createAsyncThunk<User[], void, { state: RootState }>(
  "users/loadAll",
  async (_, { getState }) => {
    const token = getState().session.token;
    return await fetchAllUsers(token!);
  }
);

// Register user (public)
export const registerUserThunk = createAsyncThunk(
  "users/register",
  async (user: { username: string; email: string; password: string }) => {
    return await registerUserApi(user);
  }
);

// Update user (admin only)
export const updateUserThunk = createAsyncThunk<
  User,
  { id: string; data: Partial<User> },
  { state: RootState }
>("users/update", async ({ id, data }, { getState }) => {
  const token = getState().session.token;
  return await updateUserApi(id, data, token!);
});

// Delete user (admin only)
export const deleteUserThunk = createAsyncThunk<
  { id: string },
  string,
  { state: RootState }
>("users/delete", async (id, { getState }) => {
  const token = getState().session.token;
  return await deleteUserApi(id, token!);
});

// Ban / Unban user
export const toggleBanThunk = createAsyncThunk<
  User,
  string,
  { state: RootState }
>("users/toggleBan", async (id, { getState }) => {
  const token = getState().session.token;
  const allUsers = await fetchAllUsers(token!);

  const user = allUsers.find((u: User) => u.id === id);
  if (!user) throw new Error("User not found");

  return await updateUserApi(id, { banned: !user.banned }, token!);
});

// Promote / demote admin
export const setAdminThunk = createAsyncThunk<
  User,
  { id: string; value: boolean },
  { state: RootState }
>("users/setAdmin", async ({ id, value }, { getState }) => {
  const token = getState().session.token;
  return await updateUserApi(id, { isAdmin: value }, token!);
});

/* ==========================================================
SECTION 4: Slice Logic
========================================================== */
const usersSlice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Load all users
      .addCase(loadUsers.fulfilled, (_, action) => {
        return action.payload;
      })

      // Update user
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const idx = state.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
      })

      // Delete user
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        return state.filter((u) => u.id !== action.payload.id);
      })

      // Toggle ban
      .addCase(toggleBanThunk.fulfilled, (state, action) => {
        const idx = state.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
      })

      // Set admin
      .addCase(setAdminThunk.fulfilled, (state, action) => {
        const idx = state.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
      });
  },
});

/* ==========================================================
SECTION 5: Export reducer
========================================================== */
export default usersSlice.reducer;
