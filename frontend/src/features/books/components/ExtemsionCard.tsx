import React from "react";
import styles from "../../../styles/components/books/cards/ExtensionCard.module.scss";
import RatingStars from "./RatingStars";
import type { Book } from "../../../store/Slices/booksSlice";

const ExtensionCard: React.FC<{ book: Book }> = ({ book }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.bigCard}>
        <div className={styles.left}>
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className={styles.cover}
            />
          ) : (
            <div className={styles.coverPlaceholder}>No Cover</div>
          )}
        </div>

        <div className={styles.right}>
          <h2 className={styles.title}>{book.title}</h2>
          <p className={styles.author}>By {book.author}</p>

          <div className={styles.rating}>
            <RatingStars value={Math.round(book.rating || 0)} />
          </div>

          <p className={styles.description}>{book.description}</p>

          <div className={styles.meta}>
            <span>Status: {book.status}</span>
            <span>Chapters: {book.chapters.length}</span>
          </div>

          <div className={styles.genres}>
            {book.genres.map((g) => (
              <span key={g} className={styles.genre}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionCard;
