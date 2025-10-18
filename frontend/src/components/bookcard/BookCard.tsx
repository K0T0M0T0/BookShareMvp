/* =========================
File: src/components/books/BookCard.tsx
========================= */
import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  addToList,
  removeFromList,
  type BuiltInList,
} from "../../store/Slices/readingListsSlice";
import { Bookmark, ImageOff } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ListMenu from "./components/listmenu";
import type { Book } from "../../store/Slices/booksSlice";
import styles from "./BookCard.module.scss";
import RatingStars from "./components/RatingStars";

// BookCard component: displays a single book as a clickable cover card.
// Default state shows the cover with title and rating. Hover reveals details.
export const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useSelector((s: RootState) => s.session.userId);
  const listEntry = useSelector((s: RootState) =>
    userId
      ? s.readingLists.find((e) => e.userId === userId && e.bookId === book.id)
      : undefined
  );

  const inList = Boolean(listEntry);
  const listName = listEntry?.list;
  const navigate = useNavigate();

  // UI state for selection menu
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  const builtInLists: BuiltInList[] = [
    "later",
    "reading",
    "completed",
    "dropped",
  ];

  // read user custom collections from localStorage (ProfilePage stores them under lists_{userId})
  const customLists: string[] = userId
    ? (
        JSON.parse(localStorage.getItem(`lists_${userId}`) || "[]") as any[]
      ).map((l) => l.name)
    : [];

  const handleSelectList = (list: string) => {
    if (!userId) {
      alert("Please login to manage reading lists");
      setMenuOpen(false);
      return;
    }
    // if current list and selecting same, treat as no-op
    if (inList && list === listName) {
      setMenuOpen(false);
      return;
    }
    // Keep custom collections in localStorage (lists_{userId}) in sync
    try {
      const key = `lists_${userId}`;
      const collections: { name: string; ids: string[] }[] = JSON.parse(
        localStorage.getItem(key) || "[]"
      );
      // remove this book from any custom collection first
      let mutated = false;
      for (const col of collections) {
        const before = col.ids.length;
        col.ids = col.ids.filter((id) => id !== book.id);
        if (col.ids.length !== before) mutated = true;
      }
      // if selecting a custom collection (non built-in), add the book to that collection
      const builtInSets: Record<string, true> = {
        later: true,
        reading: true,
        completed: true,
        dropped: true,
      } as const;
      if (!builtInSets[list as keyof typeof builtInSets]) {
        const target = collections.find(
          (c) => c.name.toLowerCase() === String(list).toLowerCase()
        );
        if (target) {
          if (!target.ids.includes(book.id)) {
            target.ids.push(book.id);
            mutated = true;
          }
        }
      }
      if (mutated) {
        localStorage.setItem(key, JSON.stringify(collections));
        window.dispatchEvent(
          new CustomEvent("collections:changed", { detail: { userId } })
        );
      }
    } catch {}

    dispatch(addToList({ userId, bookId: book.id, list } as any));
    setMenuOpen(false);
  };

  const handleRemove = () => {
    if (!userId) return;
    // Also remove from any custom collections for this user
    try {
      const key = `lists_${userId}`;
      const collections: { name: string; ids: string[] }[] = JSON.parse(
        localStorage.getItem(key) || "[]"
      );
      let mutated = false;
      for (const col of collections) {
        const before = col.ids.length;
        col.ids = col.ids.filter((id) => id !== book.id);
        if (col.ids.length !== before) mutated = true;
      }
      if (mutated) {
        localStorage.setItem(key, JSON.stringify(collections));
        window.dispatchEvent(
          new CustomEvent("collections:changed", { detail: { userId } })
        );
      }
    } catch {}

    dispatch(removeFromList({ userId, bookId: book.id }));
    setMenuOpen(false);
  };

  // Navigate to the book page when the card is clicked or activated via keyboard
  const handleOpen = () => navigate(`/books/${book.id}`);

  return (
    <div
      className={styles.card}
      role="button"
      tabIndex={0}
      onClick={handleOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleOpen();
        }
      }}
      aria-label={`Open ${book.title}`}
    >
      {/* Left: fixed cover area with title+rating overlay (default visible) */}
      <div className={styles.coverWrap}>
        {/* Top-right bookmark/list control. Clicking it should not trigger navigation. */}
        <div className={styles.bookmarkWrap} ref={menuRef}>
          <button
            className={`${styles.bookmarkBtn} ${inList ? styles.active : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              if (!userId) return alert("Please login to manage reading lists");
              setMenuOpen((s) => !s);
            }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={inList ? `Saved in ${listName}` : "Add to reading list"}
            title={inList ? `Saved in: ${listName}` : "Add to reading list"}
          >
            <Bookmark size={20} />
          </button>

          {menuOpen && (
            <ListMenu
              ref={menuRef}
              builtInLists={builtInLists}
              customLists={customLists}
              inList={inList}
              listName={listName}
              onSelect={handleSelectList}
              onRemove={handleRemove}
            />
          )}
        </div>

        {book.coverUrl ? (
          <img
            className={styles.coverImg}
            src={book.coverUrl}
            alt={book.title}
          />
        ) : (
          <div
            className={styles.coverPlaceholder}
            aria-label="no cover available"
          >
            <ImageOff size={28} />
            <span>No cover</span>
          </div>
        )}
        <div className={styles.titleBar}>
          <h3 className={styles.title}>{book.title}</h3>
          <div className={styles.ratingRow}>
            <RatingStars value={Math.round(book.rating || 0)} />
          </div>
        </div>
      </div>

      {/* Right: expanding details panel on hover/focus */}
      <div className={styles.detailsPanel} aria-hidden="true">
        <div className={styles.detailsInner}>
          {/* Header: title + author */}
          <div className={styles.headerRow}>
            <h3 className={styles.panelTitle}>{book.title}</h3>
            <p className={styles.panelAuthor}>By {book.author}</p>
          </div>

          {/* Rating under the header */}
          <div className={styles.panelRating}>
            <RatingStars value={Math.round(book.rating || 0)} />
          </div>

          {/* Status + Chapters row */}
          <div className={styles.infoRow}>
            <span className={`${styles.status} ${styles[book.status]}`}>
              {book.status}
            </span>
            <span className={styles.chapters}>
              Chapters: {book.chapters.length}
            </span>
          </div>

          {/* Description */}
          <p className={styles.panelDescription}>{book.description}</p>

          {/* Genres / tags */}
          <div className={styles.genres}>
            {book.genres.map((g) => (
              <span key={g} className={styles.genreTag}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
