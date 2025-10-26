/* =========================
File: src/components/books/BookCard.tsx
========================= */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  addToList,
  removeFromList,
  type BuiltInList,
} from "../../store/Slices/readingListsSlice";
import { Bookmark, ImageOff } from "lucide-react";
import ListMenu from "./components/listmenu";
import type { Book } from "../../store/Slices/booksSlice";
import styles from "./BookCard.module.scss";
import RatingStars from "./components/RatingStars";
import ExtensionCard from "./components/ExtemsionCard";

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

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuHover, setMenuHover] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showExtension, setShowExtension] = useState(false);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const bookmarkRef = useRef<HTMLButtonElement | null>(null);

  // === Close menu when clicking outside ===
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        !menuRef.current?.contains(e.target as Node) &&
        !bookmarkRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // === Hover handling for extension ===
  useEffect(() => {
    if (hovered && !menuOpen && !inList) {
      hoverTimerRef.current = setTimeout(() => {
        setShowExtension(true);
      }, 1000); // ⏱️ 1 seconds before showing
    } else {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      setShowExtension(false);
    }

    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, [hovered, menuOpen, inList]);

  // === Handle hover for bookmark menu ===
  useEffect(() => {
    if (menuHover) {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
      setMenuOpen(true);
    } else {
      // small delay to prevent flicker
      closeTimeoutRef.current = setTimeout(() => setMenuOpen(false), 300);
    }
    return () => {
      if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };
  }, [menuHover]);

  const builtInLists: BuiltInList[] = [
    "later",
    "reading",
    "completed",
    "dropped",
  ];
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
    if (inList && list === listName) {
      setMenuOpen(false);
      return;
    }

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
      const builtInSets: Record<string, true> = {
        later: true,
        reading: true,
        completed: true,
        dropped: true,
      };
      if (!builtInSets[list as keyof typeof builtInSets]) {
        const target = collections.find(
          (c) => c.name.toLowerCase() === String(list).toLowerCase()
        );
        if (target && !target.ids.includes(book.id)) {
          target.ids.push(book.id);
          mutated = true;
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

  const handleOpen = () => {
    if (menuOpen) return; // ⛔ prevent card click if menu open
    navigate(`/books/${book.id}`);
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      bookmarkRef.current?.contains(target) ||
      menuRef.current?.contains(target)
    )
      return;
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    setShowExtension(false);
  };

  return (
    <>
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
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.coverWrap}>
          <div
            className={styles.bookmarkWrap}
            ref={menuRef}
            onMouseEnter={() => setMenuHover(true)}
            onMouseLeave={() => setMenuHover(false)}
          >
            <button
              ref={bookmarkRef}
              className={`${styles.bookmarkBtn} ${inList ? styles.active : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                if (!userId)
                  return alert("Please login to manage reading lists");
                setMenuOpen((s) => !s); // click toggles manually
              }}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              aria-label={
                inList ? `Saved in ${listName}` : "Add to reading list"
              }
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
                onClose={() => setMenuOpen(false)}
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
      </div>

      {/* ✅ Extension appears only after 3s hover, if no bookmark/menu active */}
      {showExtension && (
        <ExtensionCard book={book} onClose={() => setShowExtension(false)} />
      )}
    </>
  );
};
