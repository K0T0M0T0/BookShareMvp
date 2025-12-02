/* ==========================================================
File: src/store/Slices/logsSlice.ts
Purpose: Manage logs from backend instead of localStorage.
Backend routes:
  GET    /api/logs        (admin only)
  POST   /api/logs        (any logged user)
  DELETE /api/logs        (admin only)
========================================================== */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../index";

/* ==========================================================
SECTION 1: Log entry structure
========================================================== */

export interface LogEntry {
  _id?: string; // MongoDB ID
  type: string; // book, chapter, user, etc.
  action: string; // human-readable text
  userId: string; // who triggered the log
  targetId?: string; // affected resource
  timestamp?: string; // auto-created in backend
  extra?: string; // extra description if needed
}

/* ==========================================================
SECTION 2: Initial state
========================================================== */

const initial: LogEntry[] = [];

/* ==========================================================
SECTION 3: API URL
========================================================== */
const API_URL = "http://localhost:5000/api/logs";

/* ==========================================================
SECTION 4: Async Thunks
========================================================== */

// Fetch all logs (admin only)
export const loadLogs = createAsyncThunk<
  LogEntry[],
  void,
  { state: RootState }
>("logs/load", async (_, { getState }) => {
  const token = getState().session.token;

  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
});

// Add a single log to backend
export const addLogToServer = createAsyncThunk<
  LogEntry,
  Omit<LogEntry, "_id" | "timestamp">,
  { state: RootState; rejectValue: string }
>("logs/add", async (logData, { getState, rejectWithValue }) => {
  try {
    const token = getState().session.token;

    const res = await axios.post(API_URL, logData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data;
  } catch (err: any) {
    console.error(
      "Failed to save log:",
      err?.response?.data || err?.message || err
    );
    // ⬇️ important: we do NOT throw, we just reject the thunk
    return rejectWithValue("Failed to save log");
  }
});

// Delete ALL logs (admin only)
export const clearLogsOnServer = createAsyncThunk<
  void,
  void,
  { state: RootState }
>("logs/clear", async (_, { getState }) => {
  const token = getState().session.token;

  await axios.delete(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
});

/* ==========================================================
SECTION 5: Slice
========================================================== */

const logsSlice = createSlice({
  name: "logs",
  initialState: initial,
  reducers: {}, // No local reducers needed now
  extraReducers: (builder) => {
    builder
      .addCase(loadLogs.fulfilled, (_, action) => {
        return action.payload;
      })

      .addCase(addLogToServer.fulfilled, (state, action) => {
        state.unshift(action.payload);
      })

      .addCase(clearLogsOnServer.fulfilled, () => {
        return [];
      });
  },
});

/* ==========================================================
SECTION 6: Export reducer
========================================================== */

export default logsSlice.reducer;
export { clearLogsOnServer as clearLogs };
