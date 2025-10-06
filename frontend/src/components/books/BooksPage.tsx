/* =========================
File: src/pages/books/BooksPage.tsx
========================= */
// React import not required in modern TSX with JSX runtime
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { BookCard } from "./BookCard";
import styles from "./BooksPage.module.css";

export default function BooksPage() {
  const books = useSelector((s: RootState) => s.books);
  return (
    <section className={styles.page}>
      <h2 className={styles.title}>Books</h2>
      <div className={styles.grid}>
        {books.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}
