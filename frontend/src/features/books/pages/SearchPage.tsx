import React from "react";
import { useAppSelector } from "../../../app/hooks";
import { BookCard } from "../components/BookCard";
import Styles from "../../../styles/components/books/SearchPage.module.scss";
import GenreFilter from "../components/GenreFilter";
import TagFilter from "../components/TagFilter";

export default function SearchPage() {
  const allBooks = useAppSelector((s) => s.books);
  const books = allBooks.filter((b) => b.approved); // ✅ only show approved books
  const [q, setQ] = React.useState("");
  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [status, setStatus] = React.useState("");
  const [minChapters, setMinChapters] = React.useState<number | "">("");
  const [maxChapters, setMaxChapters] = React.useState<number | "">("");

  const allGenres = Array.from(new Set(books.flatMap((b) => b.genres))).sort();
  const allTags = Array.from(new Set(books.flatMap((b) => b.tags))).sort();

  const results = books.filter((b) => {
    const qMatch =
      b.title.toLowerCase().includes(q.toLowerCase()) ||
      b.tags.join(" ").toLowerCase().includes(q.toLowerCase()) ||
      b.genres.join(" ").toLowerCase().includes(q.toLowerCase());

    const genreMatch =
      selectedGenres.length === 0 ||
      selectedGenres.some((g) => b.genres.includes(g));

    const tagMatch =
      selectedTags.length === 0 || selectedTags.some((t) => b.tags.includes(t));

    const statusMatch = !status || b.status === status;

    const minOk = !minChapters || b.chapters.length >= minChapters;
    const maxOk = !maxChapters || b.chapters.length <= maxChapters;

    return qMatch && genreMatch && tagMatch && statusMatch && minOk && maxOk;
  });

  return (
    <section>
      <h2>Search Books</h2>

      {/* --- Search Input --- */}
      <div className={Styles.searchbar}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by title, tag, genre"
        />
      </div>

      {/* --- Filters --- */}
      <div className={Styles.filters}>
        <GenreFilter
          genres={allGenres}
          selectedGenres={selectedGenres}
          onChange={setSelectedGenres}
        />
        <TagFilter
          tags={allTags}
          selectedTags={selectedTags}
          onChange={setSelectedTags}
        />

        <div className={Styles.filterGroup}>
          <label>Status:</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Any</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="dropped">Dropped</option>
          </select>
        </div>

        <div className={Styles.filterGroup}>
          <label>Chapters:</label>
          <div className={Styles.rangeInputs}>
            <input
              type="number"
              placeholder="Min"
              value={minChapters}
              onChange={(e) =>
                setMinChapters(e.target.value ? Number(e.target.value) : "")
              }
            />
            <span>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxChapters}
              onChange={(e) =>
                setMaxChapters(e.target.value ? Number(e.target.value) : "")
              }
            />
          </div>
        </div>
      </div>

      {/* --- Results --- */}
      <div className={Styles.resultsGrid}>
        {results.length === 0 ? (
          <p>No books found matching your filters.</p>
        ) : (
          results.map((b) => <BookCard key={b.id} book={b} />)
        )}
      </div>
    </section>
  );
}
