/* =========================
File: src/pages/books/BookPage.tsx
========================= */
import React from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import { removeBook, editBook, rateBook } from "../../store/Slices/booksSlice";
import AddChapterForm from "./AddChapterForm/AddChapterForm";
import styles from "./BookPage.module.css";
import RatingStars from "../../components/bookcard/components/RatingStars";

export default function BookPage() {
  const { id } = useParams();
  const book = useSelector((s: RootState) => s.books.find((b) => b.id === id));
  const session = useSelector((s: RootState) => s.session);
  const dispatch = useDispatch<AppDispatch>();
  if (!book) return <p>Book not found</p>;

  const isUploader = session.userId === book.uploaderId;

  return (
    <section className={styles.pageContainer}>
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
            <Rating id={book.id} value={book.rating || 0} />
          </div>
        </div>
      </div>

      <div className={styles.chaptersSection}>
        <div className={styles.chaptersHeader}>
          <h3>Chapters</h3>
          <span>{book.chapters.length} total</span>
        </div>
        <ol className={styles.chaptersList}>
          {book.chapters.map((c) => (
            <li key={c.id} className={styles.chaptersItem}>
              <Link to={`/books/${book.id}/ch/${c.id}`}>
                {c.index}. {c.title}
              </Link>
              {c.createdAt && (
                <span style={{ marginLeft: 8, color: "var(--text-secondary)" }}>
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              )}
            </li>
          ))}
        </ol>

        {isUploader && (
          <div>
            <AddChapterForm bookId={book.id} />
            <button
              onClick={() => {
                dispatch(
                  editBook({ id: book.id, data: { status: "finished" } })
                );
              }}
            >
              Mark as Finished
            </button>
            <button
              onClick={() => {
                dispatch(removeBook({ id: book.id }));
              }}
            >
              Delete Book
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function Rating({ id, value }: { id: string; value: number }) {
  const dispatch = useDispatch<AppDispatch>();
  const [myRating, setMyRating] = React.useState<number>(() => {
    const raw = localStorage.getItem(`my_rating_${id}`);
    return raw ? Number(raw) : 0;
  });

  const handleRate = (n: number) => {
    setMyRating(n);
    localStorage.setItem(`my_rating_${id}`, String(n));
    dispatch(rateBook({ id, rating: n }));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <RatingStars
        value={value}
        onChange={handleRate}
        selected={myRating > 0 ? myRating : undefined}
        showLabel
      />
      {myRating > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Your rating: <strong>{myRating}</strong>
          <span aria-hidden>★</span>
        </span>
      )}
    </div>
  );
}
