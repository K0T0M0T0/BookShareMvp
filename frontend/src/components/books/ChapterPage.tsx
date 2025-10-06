/* =========================
File: src/pages/books/ChapterPage.tsx
========================= */
import React from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

export default function ChapterPage() {
  const { id, cid } = useParams();
  const book = useSelector((s: RootState) => s.books.find((b) => b.id === id));
  if (!book) return <p>Book not found</p>;
  const chapter = book.chapters.find((c) => c.id === cid);
  if (!chapter) return <p>Chapter not found</p>;

  return (
    <article>
      <h2>{chapter.title}</h2>
      <div style={{ whiteSpace: "pre-wrap" }}>{chapter.content}</div>
    </article>
  );
}
