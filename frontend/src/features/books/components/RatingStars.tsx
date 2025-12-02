/* =========================
File: BookShareMvp/frontend/src/features/books/components/RatingStars.tsx
========================= */

import React from "react";
import { Star } from "lucide-react";
import styles from "../../../styles/components/books/cards/RatingBlock.module.scss";

export type RatingStarsProps = {
  value: number; // average rating, can be 3.5 etc.
  onChange?: (value: number) => void;
  selected?: number;
  showLabel?: boolean;
};

const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  selected,
  showLabel = false,
}) => {
  const [hover, setHover] = React.useState<number | null>(null);

  const renderStar = (index: number) => {
    const fullValue = hover ?? selected ?? value;
    const isFull = fullValue >= index;
    const isHalf = fullValue >= index - 0.5 && fullValue < index;

    return (
      <div
        key={index}
        className={styles.starWrapper}
        onClick={() => onChange?.(index)}
        onMouseEnter={() => setHover(index)}
        onMouseLeave={() => setHover(null)}
      >
        {/* Empty star */}
        <Star className={styles.emptyStar} strokeWidth={1.5} />

        {/* Full or half */}
        <Star
          className={`${styles.filledStar} ${
            isFull ? styles.full : isHalf ? styles.half : ""
          }`}
          strokeWidth={1.5}
        />
      </div>
    );
  };

  return (
    <div className={styles.ratingStars}>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="halfStar">
            <stop offset="50%" stopColor="#f5a623" />
            <stop offset="50%" stopColor="transparent" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {Array.from({ length: 5 }, (_, i) => renderStar(i + 1))}

      {showLabel && (
        <span className={styles.label}>
          {(Math.round(value * 2) / 2).toFixed(1)} / 5
        </span>
      )}
    </div>
  );
};

export default RatingStars;
