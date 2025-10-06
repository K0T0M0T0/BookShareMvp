/* =========================
File: src/pages/Dashboard.tsx
========================= */
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export default function Dashboard() {
  const books = useSelector((s: RootState) => s.books);
  const updates = books
    .flatMap((b) =>
      b.chapters.map((c) => ({
        bookId: b.id,
        bookTitle: b.title,
        coverUrl: b.coverUrl,
        chapterIndex: c.index,
        chapterTitle: c.title,
        createdAt: c.createdAt,
      }))
    )
    .filter((u) => u.createdAt)
    .sort((a, b) => (a.createdAt! > b.createdAt! ? -1 : 1));

  return (
    <section className="container">
      <h2>Updates</h2>
      <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {updates.map((u) => (
          <div key={`${u.bookId}-${u.chapterIndex}`} style={{ background: "var(--card-bg)", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,.08)", padding: 12 }}>
            {u.coverUrl ? (
              <img src={u.coverUrl} alt={u.bookTitle} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
            ) : (
              <div style={{ width: "100%", height: 140, background: "#e5e7eb", borderRadius: 8 }} />
            )}
            <div style={{ marginTop: 8 }}>
              <div style={{ fontWeight: 600 }}>{u.bookTitle}</div>
              <div style={{ color: "var(--text-secondary)", fontSize: 14 }}>
                Chapter {u.chapterIndex}: {u.chapterTitle}
              </div>
              <div style={{ color: "var(--text-secondary)", fontSize: 12, marginTop: 4 }}>
                {new Date(u.createdAt!).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
