/* =========================
File: src/pages/books/BookPage.tsx
========================= */

import React from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import styles from "../../../styles/components/books/BookDetailsPage.module.scss";

import BookHeader from "../components/BookHeader";
import ChaptersList from "../components/ChaptersList";
import BookActions from "../components/BookActions";

/**
 * Displays detailed information about a single book.
 * The page is divided into smaller subcomponents for clarity:
 *  - BookHeader: title, author, genres, description, rating
 *  - ChaptersList: list of chapters with creation date
 *  - BookActions: uploader-only tools (add chapter, delete, mark finished)
 */
export default function BookDetailsPage() {
  const { id } = useParams();
  const book = useAppSelector((s) => s.books.find((b) => b.id === id));
  const session = useAppSelector((s) => s.session);

  if (!book) return <p>Book not found</p>;
  const isUploader = session.userId === book.uploaderId;

  return (
    <section className={styles.pageContainer}>
      <BookHeader book={book} />
      <ChaptersList book={book} isUploader={isUploader} />
      {isUploader && <BookActions book={book} />}
    </section>
  );
}
