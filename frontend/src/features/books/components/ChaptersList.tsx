/* =========================
File: src/pages/books/components/ChaptersList.tsx
========================= */

import React from "react";
import { Link } from "react-router-dom";
import AddChapterForm from "./AddChapterForm";
import type { Book } from "../../../store/Slices/booksSlice";
import styles from "../../../styles/components/books/BookDetailsPage.module.scss";

/**
 * Displays all chapters with links and creation dates.
 * Also shows AddChapterForm for uploader if allowed.
 */
export default function ChaptersList({
  book,
  isUploader,
}: {
  book: Book;
  isUploader: boolean;
}) {
  return (
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

      {isUploader && <AddChapterForm bookId={book.id} />}
    </div>
  );
}
