/* =========================
File: src/pages/Home.tsx
========================= */
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import BookCardSmall from "../components/books/BookCardSmall";

// Home page shows recent updates: books with newest chapters
export default function Home() {
  const books = useSelector((s: RootState) => s.books);
  // sort by most recently updated (books with chapter count desc)
  const recent = [...books]
    .sort((a, b) => b.chapterAmount - a.chapterAmount)
    .slice(0, 6);

  return (
    <section>
      <h1>Welcome to Books C&R</h1>
      <p>Recent updated books</p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "1rem",
        }}
      >
        {recent.map((b) => (
          <BookCardSmall key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}
