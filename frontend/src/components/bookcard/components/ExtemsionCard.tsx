/* =========================
File: src/components/bookcard/components/ExtemsionCard.tsx
========================= */

import React from "react";
import type { Book } from "../../../store/Slices/booksSlice";
import RatingStars from "../../../features/books/components/RatingStars"; // ✅ COMPONENT, no .module.scss
import styles from "./ExtemsionCard.module.scss"; // ✅ STYLES

type Props = {
  book: Book;
};

const ExtemsionCard: React.FC<Props> = ({ book }) => {
  if (!book) return null;

  const description =
    book.description && book.description.trim().length > 0
      ? book.description
      : "No description yet.";

  const chapterCount = Array.isArray(book.chapters) ? book.chapters.length : 0;

  const rating =
    typeof book.rating === "number" && !Number.isNaN(book.rating)
      ? book.rating
      : 0;

  const genres =
    Array.isArray(book.genres) && book.genres.length > 0 ? book.genres : [];

  const tags =
    Array.isArray(book.tags) && book.tags.length > 0 ? book.tags : [];

  return (
    <article className={styles.extensionCard}>
      <header className={styles.header}>
        <h4 className={styles.title}>{book.title}</h4>
        <span className={styles.author}>by {book.author}</span>
      </header>

      <div className={styles.metaRow}>
        <span className={styles.chapters}>
          {chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}
        </span>

        <div className={styles.rating}>
          <RatingStars value={Math.round(rating)} />
          <span className={styles.ratingValue}>
            {rating > 0 ? rating.toFixed(1) : "No rating"}
          </span>
        </div>
      </div>

      <p className={styles.description}>{description}</p>

      {(genres.length > 0 || tags.length > 0) && (
        <div className={styles.labels}>
          {genres.map((g) => (
            <span key={`g-${g}`} className={styles.genre}>
              {g}
            </span>
          ))}
          {tags.map((t) => (
            <span key={`t-${t}`} className={styles.tag}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </article>
  );
};

export default ExtemsionCard;
