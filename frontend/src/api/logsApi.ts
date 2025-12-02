/* ==========================================================
File: src/api/logsApi.ts
Purpose: Talk with the backend /api/logs endpoints.

Backend routes:
  GET    /api/logs        (admin only)
  POST   /api/logs        (any logged user)
  DELETE /api/logs        (admin only)
========================================================== */

import apiClient from "./axiosInstance";

/* ==========================================================
SECTION 1: Types
========================================================== */

// What the backend returns for a log entry
export interface LogEntryDto {
  _id: string;
  type: string;
  action: string;
  userId: string;
  targetId?: string;
  timestamp: string;
  extra?: string;
}

// What the frontend sends when creating a log
export interface CreateLogDto {
  type: string;
  action: string;
  userId: string;
  targetId?: string;
  extra?: string;
}

/* ==========================================================
SECTION 2: Base URL & Helper
========================================================== */

const LOGS_PATH = "/logs";

// Small helper to build auth header from token
const authHeader = (token?: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

/* ==========================================================
SECTION 3: API Functions
========================================================== */

/**
 * Load all logs (admin only).
 * Pass the JWT token from your Redux session.
 */
export const fetchAllLogs = async (
  token: string | null
): Promise<LogEntryDto[]> => {
  const res = await apiClient.get<LogEntryDto[]>(LOGS_PATH, {
    headers: authHeader(token),
  });
  return res.data;
};

/**
 * Create a new log entry.
 * Any authenticated user can call this (according to your backend).
 */
export const createLog = async (
  log: CreateLogDto,
  token: string | null
): Promise<LogEntryDto> => {
  const res = await apiClient.post<LogEntryDto>(LOGS_PATH, log, {
    headers: authHeader(token),
  });
  return res.data;
};

/**
 * Clear ALL logs (admin only).
 */
export const clearAllLogs = async (token: string | null): Promise<void> => {
  await apiClient.delete(LOGS_PATH, {
    headers: authHeader(token),
  });
};
