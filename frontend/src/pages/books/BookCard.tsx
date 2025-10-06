/* =========================
File: src/components/books/BookCard.tsx
========================= */
import React from "react";
import { Link } from "react-router-dom";
import type { Book } from "../../store/booksSlice";
import styles from "./BookCard.module.css";

// Displays book short info in list view
export const BookCard: React.FC<{ book: Book }> = ({ book }) => (
  <div className={styles.card}>
    <h3>{book.title}</h3>
    <p>מאת: {book.author}</p>
    <p>{book.description}</p>
    <p>סטטוס: {book.status}</p>
    <Link to={`/books/${book.id}`}>פתח ספר</Link>
  </div>
);
