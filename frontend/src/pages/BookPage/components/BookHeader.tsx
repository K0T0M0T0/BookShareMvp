/* =========================
File: src/pages/books/components/BookHeader.tsx
========================= */

import React from "react";
import styles from "../BookPage.module.css";
import RatingBlock from "./RatingBlock";
import type { Book } from "../../../store/Slices/booksSlice";

/**
 * Renders the book cover, title, author, genres, and rating section.
 */
export default function BookHeader({ book }: { book: Book }) {
  return (
    <div className={styles.header}>
      {book.coverUrl ? (
        <img className={styles.cover} src={book.coverUrl} alt={book.title} />
      ) : (
        <div className={styles.cover} style={{ background: "#e5e7eb" }} />
      )}

      <div className={styles.info}>
        <h2 className={styles.title}>{book.title}</h2>
        <p className={styles.author}>By {book.author}</p>
        <div className={styles.status}>Status: {book.status}</div>
        <div className={styles.genres}>Genres: {book.genres.join(", ")}</div>
        <p className={styles.description}>{book.description}</p>

        <div className={styles.actions}>
          <RatingBlock id={book.id} value={book.rating || 0} />
        </div>
      </div>
    </div>
  );
}
