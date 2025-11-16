/* =========================
File: src/store/Slices/logsSlice.ts
Keeps track of all logs locally (localStorage).
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

export interface LogEntry {
  id: string;
  type: string;
  action: string;
  userId: string;
  targetId?: string;
  timestamp: string;
  extra?: string;
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

      state.unshift(log);
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
