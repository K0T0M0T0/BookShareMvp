import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link, useParams } from "react-router-dom";
import styles from "./collections.module.scss";
import CollectionView from "./components/CollectionView";
import CollectionsOverview from "./components/CollectionsOverview";

// Collections page: show either a specific collection/list (by route param)
// or a listing of all collections when no param provided.
export default function CollectionsPage() {
  const { id } = useParams(); // id can be a list name or 'built:later' style
  const books = useSelector((s: RootState) => s.books);
  const readingLists = useSelector((s: RootState) => s.readingLists);

  if (id) {
    // show contents of a single list/collection
    let entries = [] as string[];
    const decodedId = decodeURIComponent(id);
    if (decodedId.startsWith("built:")) {
      const listName = decodedId.replace("built:", "");
      entries = readingLists
        .filter((r) => r.list === listName)
        .map((r) => r.bookId);
    } else {
      // custom collection (stored in localStorage per user)
      const currentUser = JSON.parse(
        localStorage.getItem("mvp_session") || '{"userId":null}'
      ).userId;
      if (currentUser) {
        const key = `lists_${currentUser}`;
        const lists = JSON.parse(localStorage.getItem(key) || "[]") as any[];
        const found = lists.find((l) => l.name.toLowerCase() === decodedId.toLowerCase());
        entries = found ? found.ids : [];
      }
    }

    const items = books.filter((b) => entries.includes(b.id));

    return (
      <section className={styles.container}>
        <Link to="/profile">← Back</Link>
        <CollectionView title={decodedId} items={items} />
      </section>
    );
  }

  const currentUser = JSON.parse(
    localStorage.getItem("mvp_session") || '{"userId":null}'
  ).userId;

  return (
    <section className={styles.container}>
      <h2>Your Lists & Collections</h2>
      <CollectionsOverview userId={currentUser} />
    </section>
  );
}
