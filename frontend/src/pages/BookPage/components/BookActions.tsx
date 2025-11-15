/* =========================
File: src/pages/books/components/BookActions.tsx
========================= */

import React from "react";
import { useDispatch } from "react-redux";
import { saveBookEdit, removeBookFromServer } from "../../../store/Slices/booksSlice";
import type { AppDispatch } from "../../../store/store";
import type { Book } from "../../../store/Slices/booksSlice";

/**
 * Provides book management actions available only to uploader:
 *  - Mark as finished
 *  - Delete book
 */
export default function BookActions({ book }: { book: Book }) {
  const dispatch = useDispatch<AppDispatch>();

  const handleFinish = () =>
    dispatch(saveBookEdit({ id: book.id, data: { status: "finished" } }));

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${book.title}"? This action cannot be undone.`
      )
    ) {
      dispatch(removeBookFromServer(book.id));
    }
  };

  return (
    <div style={{ marginTop: "1rem" }}>
      <button onClick={handleFinish}>Mark as Finished</button>
      <button
        onClick={handleDelete}
        style={{ marginLeft: "0.5rem", color: "red" }}
      >
        Delete Book
      </button>
    </div>
  );
}
