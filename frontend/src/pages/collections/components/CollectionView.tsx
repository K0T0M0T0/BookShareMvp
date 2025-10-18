// React import intentionally omitted (new JSX transform)
import { BookCard } from "../../../components/bookcard/BookCard";
import type { Book } from "../../../store/Slices/booksSlice";

export default function CollectionView({
  title,
  items,
}: {
  title: string;
  items: Book[];
}) {
  return (
    <section>
      <h2>Collection: {title}</h2>
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
        {items.map((b) => (
          <BookCard key={b.id} book={b} />
        ))}
      </div>
      {items.length === 0 && (
        <p style={{ marginTop: 12 }}>No books in this collection</p>
      )}
    </section>
  );
}
