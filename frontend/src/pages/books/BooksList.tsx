/* =========================
File: src/pages/books/BooksList.tsx
========================= */
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { BookCard } from "../../components/books/BookCard";
import { CreateBookForm } from "../../components/books/CreateBookForm";

export const BooksList: React.FC = () => {
  const books = useSelector((s: RootState) => s.books);
  return (
    <section>
      <h2>רשימת ספרים</h2>
      <div style={{ display: "grid", gap: "1rem" }}>
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
      <CreateBookForm />
    </section>
  );
};
