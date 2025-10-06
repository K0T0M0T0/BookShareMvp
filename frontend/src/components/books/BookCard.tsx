/* =========================
File: src/components/books/BookCard.tsx
========================= */
import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { addToList, removeFromList, type BuiltInList } from "../../store/Slices/readingListsSlice";
import { Bookmark } from "lucide-react";
import type { Book } from "../../store/Slices/booksSlice";
import styles from "./BookCard.module.css";
import RatingStars from "./RatingStars";

// BookCard component: displays a single book's preview info
export const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((s: RootState) => s.session.userId);
  const listEntry = useSelector((s: RootState) =>
    userId ? s.readingLists.find((e) => e.userId === userId && e.bookId === book.id) : undefined
  );

  const inList = Boolean(listEntry);
  const listName = listEntry?.list;

  const handleToggle = () => {
    if (!userId) return;
    if (inList) dispatch(removeFromList({ userId, bookId: book.id }));
    else dispatch(addToList({ userId, bookId: book.id, list: "later" as BuiltInList }));
  };

  return (
    <div className={styles.card}>
      <div className={styles.coverWrap}>
        <button
          className={`${styles.bookmarkBtn} ${inList ? styles.active : ""}`}
          onClick={handleToggle}
          aria-label={inList ? `Remove from ${listName}` : "Add to reading list"}
          title={inList ? `Saved in: ${listName}` : "Add to reading list"}
        >
          <Bookmark size={20} />
        </button>
        {book.coverUrl ? (
          <img className={styles.coverImg} src={book.coverUrl} alt={book.title} />
        ) : (
          <div className={styles.coverImg} aria-label="default cover" />
        )}
      </div>
      <div className={styles.body}>
        <h3 className={styles.title}>{book.title}</h3>
        <p className={styles.author}>By {book.author}</p>
        <p className={styles.description}>{book.description}</p>
        <div className={styles.meta}>
          <span className={`${styles.status} ${styles[book.status]}`}>
            {book.status}
          </span>
          <div className={styles.genres}>
            {book.genres.map((g) => (
              <span key={g} className={styles.genreTag}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <p className={styles.chapters}>Chapters: {book.chapters.length}</p>
          <RatingStars value={Math.round(book.rating || 0)} />
        </div>
        <Link to={`/books/${book.id}`} className={styles.button}>Read More</Link>
      </div>
    </div>
  );
};
