import { Link } from "react-router-dom";
import { Clock, BookOpen, CheckCircle2, Ban } from "lucide-react";
import styles from "../../profile/ProfilePage.module.scss";
import type { JSX } from "react";
import React from "react";

export default function CollectionsOverview({ userId }: { userId: string }) {
  const readingLists = JSON.parse(
    localStorage.getItem("mvp_reading_lists") || "[]"
  ) as any[];
  const built = ["later", "reading", "completed", "dropped"];
  const statusIcon: Record<string, JSX.Element> = {
    later: <Clock size={20} />, // read later
    reading: <BookOpen size={20} />, // reading now
    completed: <CheckCircle2 size={20} />, // completed
    dropped: <Ban size={20} />, // dropped
  };

  const currentUser = JSON.parse(
    localStorage.getItem("mvp_session") || '{"userId":null}'
  ).userId;
  const userCollections = currentUser
    ? (JSON.parse(
        localStorage.getItem(`lists_${currentUser}`) || "[]"
      ) as any[])
    : [];

  React.useEffect(() => {
    const handler = () => {
      // trigger rerender when collections change
      setTick((x) => x + 1);
    };
    window.addEventListener("collections:changed", handler as EventListener);
    return () =>
      window.removeEventListener("collections:changed", handler as EventListener);
  }, []);

  const [, setTick] = React.useState(0);

  return (
    <div>
      <div className={styles.defaultLists}>
        <h3>Default lists</h3>
        <div className={styles.collectionGrid}>
          {built.map((b) => {
            const count = readingLists.filter(
              (r) => r.list === b && r.userId === userId
            ).length;
            return (
              <Link
                key={b}
                to={`/collections/${encodeURIComponent("built:" + b)}`}
                className={styles.collectionCard}
              >
                <div className={styles.cardContent}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
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

      <div className={styles.collections}>
        <h3>Your Collections</h3>
        <div className={styles.collectionGrid}>
          {userCollections.map((c: any, i: number) => {
            const count = Array.isArray(c.ids) ? c.ids.length : 0;
            return (
              <Link
                key={i}
                to={`/collections/${encodeURIComponent(c.name)}`}
                className={styles.collectionCard}
              >
                <div className={styles.cardContent}>
                  <h4>{c.name}</h4>
                  <p>{count} books</p>
                </div>
              </Link>
            );
          })}
          {userCollections.length === 0 && (
            <p>No collections yet. Create one below.</p>
          )}
        </div>
      </div>
    </div>
  );
}
