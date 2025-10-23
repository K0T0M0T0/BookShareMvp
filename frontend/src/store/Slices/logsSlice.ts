/* =========================
File: src/store/Slices/logsSlice.ts
Purpose: Keep track of all user/admin actions in the system.
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface LogEntry {
  id: string;
  type: "book" | "chapter" | "user";
  action: string; // e.g. "created book", "deleted user"
  userId: string; // who did it
  targetId?: string; // optional: which item was affected
  timestamp: string;
  extra?: string; // e.g. book title, username, etc.
}

const initial: LogEntry[] = JSON.parse(
  localStorage.getItem("mvp_logs") || "[]"
);

const logsSlice = createSlice({
  name: "logs",
  initialState: initial,
  reducers: {
    addLog(
      state,
      action: PayloadAction<
        Omit<LogEntry, "id" | "timestamp"> & { timestamp?: string }
      >
    ) {
      const log: LogEntry = {
        id: nanoid(),
        timestamp: action.payload.timestamp || new Date().toISOString(),
        ...action.payload,
      };
      state.unshift(log); // newest first
      localStorage.setItem("mvp_logs", JSON.stringify(state));
    },
    clearLogs(state) {
      state.length = 0;
      localStorage.setItem("mvp_logs", "[]");
    },
  },
});

export const { addLog, clearLogs } = logsSlice.actions;
export default logsSlice.reducer;
