/* =========================
File: src/components/books/BookCard.tsx
========================= */
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addToListThunk,
  removeFromListThunk,
  type BuiltInList,
} from "../../../store/Slices/readingListsSlice";
import { Bookmark, ImageOff } from "lucide-react";
import ListMenu from "./ListMenu";
import type { Book } from "../../../store/Slices/booksSlice";
import styles from "../../../styles/components/books/cards/BookCard.module.scss";
import RatingStars from "./RatingStars";
import ExtensionCard from "./ExtemsionCard";

export const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.session.userId);

  const listEntry = useAppSelector((s) =>
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
      }, 1000);
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

  const customLists: string[] = []; // backend does not support custom lists yet

  // === SELECT LIST (backend only!) ===
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

    dispatch(addToListThunk({ userId, bookId: book.id, list }));
    setMenuOpen(false);
  };

  // === REMOVE FROM LIST ===
  const handleRemove = () => {
    if (!userId) return;

    dispatch(removeFromListThunk({ userId, bookId: book.id }));
    setMenuOpen(false);
  };

  const handleOpen = () => {
    if (menuOpen) return;
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
                setMenuOpen((s) => !s);
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

      {showExtension && <ExtensionCard book={book} />}
    </>
  );
};

export default BookCard;
