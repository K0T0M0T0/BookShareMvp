/* =========================
File: src/pages/search/SearchPage.tsx
========================= */
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { BookCard } from "../../components/bookcard/BookCard";
import Styles from "./SearchPage.module.scss";

export default function SearchPage() {
  const books = useSelector((s: RootState) => s.books);
  const [q, setQ] = React.useState("");
  const [filter] = React.useState("");

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
      <div className={Styles.searchbar}>
        {
          //it should be compoennt
          //there would be a option to set a filter by genres, tags they woukld have a check boxes, and also set statuses (completed, ongoing, dropped) of the book, and minimal or max chapters
        }
      </div>
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
