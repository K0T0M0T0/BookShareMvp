/* =========================
File: src/pages/books/components/RatingBlock.tsx
========================= */

import React from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../../store/store";
import { rateBook } from "../../../store/Slices/booksSlice";
import RatingStars from "../../../components/bookcard/components/RatingStars";

/**
 * Handles displaying and updating a user's personal rating for the book.
 * Saves rating in localStorage to persist between sessions.
 */
export default function RatingBlock({
  id,
  value,
}: {
  id: string;
  value: number;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [myRating, setMyRating] = React.useState<number>(() => {
    const raw = localStorage.getItem(`my_rating_${id}`);
    return raw ? Number(raw) : 0;
  });

  const handleRate = (n: number) => {
    setMyRating(n);
    localStorage.setItem(`my_rating_${id}`, String(n));
    dispatch(rateBook({ id, rating: n }));
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <RatingStars
        value={value}
        onChange={handleRate}
        selected={myRating > 0 ? myRating : undefined}
        showLabel
      />
      {myRating > 0 && (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          Your rating: <strong>{myRating}</strong>
          <span aria-hidden>★</span>
        </span>
      )}
    </div>
  );
}
