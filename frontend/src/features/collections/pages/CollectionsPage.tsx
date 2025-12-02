import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "../../../styles/components/collections/CollectionsPage.module.scss";
import CollectionView from "../components/CollectionView";
import CollectionsOverview from "../components/CollectionsOverview";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import AddCollectionForm from "../components/AddCollectionForm";
import { loadCollections } from "../../../store/Slices/collectionsSlice";

const CollectionsPage = () => {
  const { id } = useParams(); // id can be a list name or 'built:later' style
  const dispatch = useAppDispatch();
  const books = useAppSelector((s) => s.books);
  const readingLists = useAppSelector((s) => s.readingLists);
  const collections = useAppSelector((s) => s.collections);
  const currentUser = useAppSelector((s) => s.session.userId);

  useEffect(() => {
    if (currentUser) {
      dispatch(loadCollections(currentUser));
    }
  }, [currentUser, dispatch]);

  if (id) {
    // show contents of a single list/collection
    let entries: string[] = [];
    const decodedId = decodeURIComponent(id);

    if (decodedId.startsWith("built:")) {
      const listName = decodedId.replace("built:", "");
      entries = readingLists
        .filter((r) => r.list === listName)
        .map((r) => r.bookId);
    } else if (decodedId.startsWith("custom:")) {
      const collectionId = decodedId.replace("custom:", "");
      const collection = collections.find((c) => c.id === collectionId);
      entries = collection?.books ?? [];
    }

    const items = books.filter((b) => entries.includes(b.id));

    return (
      <section className={styles.container}>
        <Link to="/collections">← Back</Link>
        <CollectionView title={decodedId} items={items} />
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h2>Your Lists & Collections</h2>
      <CollectionsOverview userId={currentUser} />
      {currentUser && <AddCollectionForm userId={currentUser} />}
    </section>
  );
};

export default CollectionsPage; // ✅ THIS is the important line
