import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Link, useParams } from "react-router-dom";
import styles from "./collections.module.scss";
import CollectionView from "./components/CollectionView";
import CollectionsOverview from "./components/CollectionsOverview";

const CollectionsPage = () => {
  const { id } = useParams(); // id can be a list name or 'built:later' style
  const books = useSelector((s: RootState) => s.books);
  const readingLists = useSelector((s: RootState) => s.readingLists);

  if (id) {
    // show contents of a single list/collection
    let entries: string[] = [];
    const decodedId = decodeURIComponent(id);

    if (decodedId.startsWith("built:")) {
      const listName = decodedId.replace("built:", "");
      entries = readingLists
        .filter((r) => r.list === listName)
        .map((r) => r.bookId);
    } else {
      // ❌ custom collections now via backend – so nothing to load here yet
      entries = [];
    }

    const items = books.filter((b) => entries.includes(b.id));

    return (
      <section className={styles.container}>
        <Link to="/profile">← Back</Link>
        <CollectionView title={decodedId} items={items} />
      </section>
    );
  }

  const currentUser = useSelector((s: RootState) => s.session.userId);

  return (
    <section className={styles.container}>
      <h2>Your Lists & Collections</h2>
      <CollectionsOverview userId={currentUser} />
    </section>
  );
};

export default CollectionsPage; // ✅ THIS is the important line
