/* =========================
File: src/components/books/BookCardSmall.tsx
========================= */
import React from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../store/Slices/booksSlice";
import styles from "./BookCardSmall.module.css";

export default function BookCardSmall({ book }: { book: Book }) {
  return (
    <div className={styles.card}>
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>
        Chapters: {book.chapterAmount} | Status: {book.status}
      </p>
      <Link to={`/books/${book.id}`}>Open</Link>
    </div>
  );
}
