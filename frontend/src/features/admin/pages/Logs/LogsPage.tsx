/* =========================
File: src/features/admin/pages/Logs/LogsPage.tsx
========================= */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import { clearLogs } from "../../../../store/Slices/logsSlice";
import styles from "./LogsPage.module.scss";

export default function LogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const logs = useSelector((s: RootState) => s.logs);

  // Group logs by type
  const grouped = {
    book: logs.filter((l) => l.type === "book"),
    chapter: logs.filter((l) => l.type === "chapter"),
    user: logs.filter((l) => l.type === "user"),
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>System Logs</h2>
        <button onClick={() => dispatch(clearLogs())}>Clear All</button>
      </div>

      {Object.entries(grouped).map(([type, entries]) => (
        <div key={type} className={styles.section}>
          <h3>
            {type === "book"
              ? "📘 Books"
              : type === "chapter"
              ? "📖 Chapters"
              : "👤 Users"}
          </h3>
          {entries.length === 0 ? (
            <p className={styles.empty}>No logs found.</p>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Action</th>
                  <th>By</th>
                  <th>Target</th>
                  <th>Extra</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((log) => (
                  <tr key={log._id}>
                    <td>
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "-"}
                    </td>
                    <td>{log.action}</td>
                    <td>{log.userId}</td>
                    <td>{log.targetId || "-"}</td>
                    <td>{log.extra || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}
