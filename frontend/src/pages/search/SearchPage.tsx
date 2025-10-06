/* =========================
File: src/pages/search/SearchPage.tsx
========================= */
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { BookCard } from "../../components/books/BookCard";

export default function SearchPage() {
  const books = useSelector((s: RootState) => s.books);
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState("");

  const results = books
    .filter(
      (b) =>
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.tags.join(" ").toLowerCase().includes(q.toLowerCase()) ||
        b.genres.join(" ").toLowerCase().includes(q.toLowerCase())
    )
    .filter((b) => (filter ? b.genres.includes(filter) : true));

  return (
    <section>
      <h2>Search Books</h2>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title, tag, genre"
      />
      <div
        style={{
          display: "grid",
          gap: "1rem",
          marginTop: 12,
          gridTemplateColumns: "repeat(auto-fill, 280px)",
          justifyContent: "start",
          alignItems: "start",
        }}
      >
        {results.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
    </section>
  );
}
