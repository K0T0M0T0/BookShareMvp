/* =========================
File: src/components/books/BookCardSmall.tsx
========================= */

import { Link } from "react-router-dom";
import type { Book } from "../../../../store/Slices/booksSlice";
import styles from "./BookCardUpdate.module.css";

export default function BookCardSmall({ book }: { book: Book }) {
  return (
    <div className={styles.upadteCard}>
      <h3>{book.title}</h3>
      <p>by {book.author}</p>
      <p>
        Chapters: {book.chapterAmount} | Status: {book.status}
      </p>
      <Link to={`/books/${book.id}`}>Open</Link>
    </div>
  );
}
