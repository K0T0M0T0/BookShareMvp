/* ==========================================================
File: src/store/Slices/usersSlice.ts
Purpose: Manage user accounts (registration, admin, bans)
and log all important user-related actions.
========================================================== */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { addLog } from "./logsSlice"; // ✅ log slice for admin audit trail
import {
  fetchAllUsers,
  registerUser as registerUserApi,
  updateUser as updateUserApi,
  deleteUser as deleteUserApi,
} from "../../api/usersApi";

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
const initial: User[] = [];

/* ==========================================================
SECTION 3: Async Thunks
========================================================== */

export const loadUsers = createAsyncThunk("users/loadAll", async () => {
  return await fetchAllUsers();
});

export const registerUserThunk = createAsyncThunk(
  "users/register",
  async (user: Omit<User, "id" | "isAdmin" | "banned">) => {
    const newUser = {
      ...user,
      isAdmin: false,
      banned: false,
    };
    return await registerUserApi(newUser);
  }
);

export const updateUserThunk = createAsyncThunk(
  "users/update",
  async ({ id, data }: { id: string; data: Partial<User> }) => {
    return await updateUserApi(id, data);
  }
);

export const deleteUserThunk = createAsyncThunk(
  "users/delete",
  async (id: string) => {
    return await deleteUserApi(id);
  }
);

export const toggleBanThunk = createAsyncThunk(
  "users/toggleBan",
  async ({ id, adminId }: { id: string; adminId?: string }) => {
    const users = await fetchAllUsers();
    const user = users.find((u: User) => u.id === id);
    if (!user) throw new Error("User not found");
    return await updateUserApi(id, { ...user, banned: !user.banned });
  }
);

export const setAdminThunk = createAsyncThunk(
  "users/setAdmin",
  async ({
    id,
    value,
    adminId,
  }: {
    id: string;
    value: boolean;
    adminId?: string;
  }) => {
    const users = await fetchAllUsers();
    const user = users.find((u: User) => u.id === id);
    if (!user) throw new Error("User not found");
    return await updateUserApi(id, { ...user, isAdmin: value });
  }
);

/* ==========================================================
SECTION 4: Slice setup
========================================================== */
const usersSlice = createSlice({
  name: "users",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.push(action.payload);
        const logData = {
          id: action.payload.id,
          username: action.payload.username,
          email: action.payload.email,
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
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        const idx = state.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) {
          const oldUser = state[idx];
          state[idx] = action.payload;
          const changed = Object.keys(action.payload).filter(
            (key) => (oldUser as any)[key] !== (action.payload as any)[key]
          );
          setTimeout(() => {
            (window as any).store?.dispatch(
              addLog({
                type: "user",
                action: `Updated profile for "${action.payload.username}"`,
                userId: action.payload.id,
                targetId: action.payload.id,
                extra: `Changed fields: ${changed.join(", ")}`,
              })
            );
          });
        }
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        // The backend returns { id: string }
        return state.filter((u) => u.id !== action.payload.id);
      })
      .addCase(toggleBanThunk.fulfilled, (state, action) => {
        const idx = state.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) {
          state[idx] = action.payload;
          const logData = action.payload;
          setTimeout(() => {
            (window as any).store?.dispatch(
              addLog({
                type: "user",
                action: logData.banned
                  ? `Banned user "${logData.username}"`
                  : `Unbanned user "${logData.username}"`,
                userId: "admin",
                targetId: logData.id,
                extra: `Email: ${logData.email}`,
              })
            );
          });
        }
      })
      .addCase(setAdminThunk.fulfilled, (state, action) => {
        const idx = state.findIndex((u) => u.id === action.payload.id);
        if (idx >= 0) {
          state[idx] = action.payload;
          const logData = action.payload;
          setTimeout(() => {
            (window as any).store?.dispatch(
              addLog({
                type: "user",
                action: logData.isAdmin
                  ? `Promoted "${logData.username}" to admin`
                  : `Revoked admin from "${logData.username}"`,
                userId: "admin",
                targetId: logData.id,
                extra: `Email: ${logData.email}`,
              })
            );
          });
        }
      });
  },
});

/* ==========================================================
SECTION 5: Exports
========================================================== */

export default usersSlice.reducer;
