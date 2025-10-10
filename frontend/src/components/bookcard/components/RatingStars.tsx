import React from "react";
import { Star } from "lucide-react";
import styles from "./RatingStars.module.css";

type Props = {
  value: number; // 0..5
  onChange?: (next: number) => void; // omit for readonly
  size?: number; // px
  showLabel?: boolean;
  selected?: number; // which star index is selected for glow (1..5)
};

export default function RatingStars({ value, onChange, size = 24, showLabel, selected }: Props) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div
      className={styles.row}
      role={onChange ? "radiogroup" : undefined}
      aria-label="Rating"
    >
      {stars.map((n) => {
        const filled = value >= n - 1e-6; // avoid float issues
        const isHighlighted = typeof selected === "number" ? n <= selected : false;
        const ButtonTag: any = onChange ? "button" : "div";
        return (
          <ButtonTag
            key={n}
            type={onChange ? "button" : undefined}
            className={`${styles.btn} ${!onChange ? styles.readonly : ""}`}
            onClick={onChange ? () => onChange(n) : undefined}
            aria-checked={onChange ? value === n : undefined}
            role={onChange ? "radio" : undefined}
          >
            <Star
              className={`${styles.star} ${filled ? styles.filled : ""} ${isHighlighted ? styles.glow : ""} ${isHighlighted ? styles.highlight : ""}`}
              size={size}
              aria-hidden="true"
            />
          </ButtonTag>
        );
      })}
      {showLabel && <span className={styles.label}>{value.toFixed(1)}</span>}
    </div>
  );
}


