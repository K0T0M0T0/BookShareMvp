import { Link } from "react-router-dom";
import { Clock, BookOpen, CheckCircle2, Ban } from "lucide-react";
import styles from "../../profile/ProfilePage.module.scss";
import type { JSX } from "react";
import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

export default function CollectionsOverview({
  userId,
}: {
  userId?: string | null;
}) {
  // Built-in reading lists come from readingListsSlice
  const readingLists = useSelector((s: RootState) => s.readingLists);

  // Custom collections come from backend (collectionsSlice)
  const collections = useSelector((s: RootState) =>
    s.collections.filter((c) => c.userId === userId)
  );

  const built = ["later", "reading", "completed", "dropped"] as const;

  const statusIcon: Record<string, JSX.Element> = {
    later: <Clock size={20} />,
    reading: <BookOpen size={20} />,
    completed: <CheckCircle2 size={20} />,
    dropped: <Ban size={20} />,
  };

  return (
    <div>
      {/* ---------------------- */}
      {/*   DEFAULT LISTS        */}
      {/* ---------------------- */}
      <div className={styles.defaultLists}>
        <h3>Default lists</h3>

        <div className={styles.collectionGrid}>
          {built.map((b) => {
            const count = readingLists.filter(
              (r) => r.userId === userId && r.list === b
            ).length;

            return (
              <Link
                key={b}
                to={`/collections/built-${b}`}
                className={styles.collectionCard}
              >
                <div className={styles.cardContent}>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    {statusIcon[b]}
                    <h4>{b[0].toUpperCase() + b.slice(1)}</h4>
                  </div>
                  <p>{count} books</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ---------------------- */}
      {/*   CUSTOM COLLECTIONS   */}
      {/* ---------------------- */}
      <div className={styles.collections}>
        <h3>Your Collections</h3>

        <div className={styles.collectionGrid}>
          {collections.length > 0 ? (
            collections.map((c) => (
              <Link
                key={c.id}
                to={`/collections/custom-${c.id}`}
                className={styles.collectionCard}
              >
                <div className={styles.cardContent}>
                  <h4>{c.name}</h4>
                  <p>{c.books.length} books</p>
                </div>
              </Link>
            ))
          ) : (
            <p>No collections yet. Create one below.</p>
          )}
        </div>
      </div>
    </div>
  );
}
