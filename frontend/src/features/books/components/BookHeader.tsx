/* =========================
File: BookShareMvp/frontend/src/features/books/components/BookHeader.tsx
========================= */

import React from "react";
import styles from "../../../styles/components/books/BookDetailsPage.module.scss";
import RatingBlock from "./RatingBlock";
import type { Book } from "../../../store/Slices/booksSlice";

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
          <RatingBlock
            bookId={book.id}
            value={book.rating || 0}
            ratingsCount={book.ratingsCount ?? 0}
          />
        </div>
      </div>
    </div>
  );
}
