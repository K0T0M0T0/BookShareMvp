/* =========================
File: src/pages/Home.tsx
========================= */

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import BookCardSmall from "./components/updateBookCard.tsx/BookCardUpdate";

export default function Home() {
  const books = useSelector((s: RootState) => s.books);
  const readlist = useSelector((s: RootState) => s.users || []);

  // sort books by chapter updates (most updated first)
  const recent = [...books]
    .sort((a, b) => b.chapterAmount - a.chapterAmount)
    .slice(0, 9);

  // filter books that exist in user's readlist
  const userUpdates = recent.filter((b) => readlist.includes(b.id));

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        gap: "2rem",
        alignItems: "start",
      }}
    >
      {/* Left side: user's readlist updates */}
      <div>
        <h2>Your Readlist Updates</h2>
        {userUpdates.length > 0 ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {userUpdates.map((b) => (
              <BookCardSmall key={b.id} book={b} />
            ))}
          </div>
        ) : (
          <p style={{ color: "#6b7280" }}>
            No recent updates in your readlist yet.
          </p>
        )}
      </div>

      {/* Right side: general updates */}
      <div>
        <h2>Recent Updates</h2>
        <p>Books with newly added chapters</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {recent.map((b) => (
            <BookCardSmall key={b.id} book={b} />
          ))}
        </div>
      </div>
    </section>
  );
}
