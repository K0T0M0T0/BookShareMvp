/* =========================
File: BookShareMvp/frontend/src/features/books/components/RatingBlock.tsx
========================= */

import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { rateBookOnServer } from "../../../store/Slices/booksSlice";
import RatingStars from "./RatingStars";
import styles from "../../../styles/components/books/cards/RatingBlock.module.scss";

type RatingBlockProps = {
  bookId: string;
  value: number; // average rating from backend
  ratingsCount?: number; // how many ratings total
};

const RatingBlock: React.FC<RatingBlockProps> = ({
  bookId,
  value,
  ratingsCount = 0,
}) => {
  const dispatch = useAppDispatch();
  const session = useAppSelector((s) => s.session);

  const [localRating, setLocalRating] = useState<number>(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = async (newValue: number) => {
    // front-end guard – only logged in users can rate
    if (!session.token) {
      setError("You must be logged in to rate this book.");
      return;
    }

    setError(null);
    setLocalRating(newValue);

    try {
      setSaving(true);
      await dispatch(
        rateBookOnServer({ id: bookId, rating: newValue })
      ).unwrap();
    } catch (err) {
      console.error("Failed to save rating", err);
      setError("Failed to save rating.");
      setLocalRating(value); // revert
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.ratingBlock}>
      <RatingStars
        value={value} // backend average
        selected={localRating} // local click/hover feedback
        onChange={handleChange}
        showLabel
      />

      <div className={styles.meta}>
        <span className={styles.count}>
          {ratingsCount} {ratingsCount === 1 ? "rating" : "ratings"}
        </span>
        {saving && <span className={styles.saving}>Saving...</span>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    </div>
  );
};

export default RatingBlock;
