/* =========================
File: src/components/bookcard/components/RatingStars.tsx
========================= */
import React from "react";
import { Star } from "lucide-react";
import styles from "../../../styles/components/books/cards/Ratingstars.module.scss";

interface RatingStarsProps {
  value: number; // 0–5
  max?: number;
}

const RatingStars: React.FC<RatingStarsProps> = ({ value, max = 5 }) => {
  const clamped = Math.max(0, Math.min(value, max));

  return (
    <div className={styles.stars} aria-label={`Rating: ${clamped} of ${max}`}>
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < clamped;
        return (
          <Star
            key={i}
            size={16}
            className={filled ? styles.filled : styles.empty}
          />
        );
      })}
    </div>
  );
};

export default RatingStars;
