import { useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { BookCard } from "../../components/bookcard/BookCard";
import styles from "./Home.module.scss";

export default function Home() {
  // Active tab for mobile view — "user" or "global"
  const [activeTab, setActiveTab] = useState<"user" | "global">("user");

  // Fetch global state values
  const books = useSelector((s: RootState) => s.books); // All books in store
  const readingLists = useSelector((s: RootState) => s.readingLists); // User reading list data
  const session = useSelector((s: RootState) => s.session); // Current user session info
  const userId = session.userId; // Current logged-in user ID

  /* =========================
     Create "Recent Updates" list
     - Sort books by most chapters
     - Limit to top 9
  ========================= */
  const recentAll = [...books]
    .sort((a, b) => b.chapterAmount - a.chapterAmount)
    .slice(0, 9);

  /* =========================
     Create "Your Updates" list
     - Filter only books in user's reading list
     - Then intersect with recent updates
  ========================= */
  const userEntries = readingLists.filter((e) => e.userId === userId);
  const userBookIds = userEntries.map((e) => e.bookId);
  const userUpdates = recentAll.filter((b) => userBookIds.includes(b.id));
  const recent = recentAll.filter((b) => !userBookIds.includes(b.id));

  return (
    <section className={styles.homeContainer}>
      {/* =========================
          Top Tabs (Mobile only)
          - Allows switching between "Your" and "All" updates
      ========================= */}
      <div className={styles.topTabs}>
        <button
          className={`${styles.tabButton} ${
            activeTab === "user" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("user")}
        >
          Your Updates
        </button>

        <button
          className={`${styles.tabButton} ${
            activeTab === "global" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("global")}
        >
          All Updates
        </button>
      </div>

      {/* =========================
          Main Content Grid
          - User updates on the left
          - Global updates on the right
      ========================= */}
      <div className={styles.contentGrid}>
        {/* ===== Left Column: Personalized (User) Updates ===== */}
        <div
          className={`${styles.userUpdates} ${
            activeTab === "user" ? styles.visible : styles.hidden
          }`}
        >
          <h2>Your Readlist Updates</h2>

          {/* If user has updates, show BookCards. Otherwise show placeholder */}
          {userUpdates.length > 0 ? (
            <div className={styles.cardGrid}>
              {userUpdates.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          ) : (
            <p className={styles.emptyText}>
              No recent updates in your reading lists.
            </p>
          )}
        </div>

        {/* ===== Right Column: Global Updates ===== */}
        <div
          className={`${styles.globalUpdates} ${
            activeTab === "global" ? styles.visible : styles.hidden
          }`}
        >
          <h2>Recent Updates</h2>
          <p className={styles.subtitle}></p>

          <div className={styles.cardGrid}>
            {recent.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
