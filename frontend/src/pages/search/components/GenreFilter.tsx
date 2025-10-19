import React, { useState } from "react";
import styles from "./FilterSelect.module.scss";

interface GenreFilterProps {
  genres: string[];
  selectedGenres: string[];
  onChange: (selected: string[]) => void;
}

const GenreFilter: React.FC<GenreFilterProps> = ({
  genres,
  selectedGenres,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleGenre = (genre: string) => {
    onChange(
      selectedGenres.includes(genre)
        ? selectedGenres.filter((g) => g !== genre)
        : [...selectedGenres, genre]
    );
  };

  return (
    <div className={styles.filterBox}>
      <button
        type="button"
        className={styles.filterToggle}
        onClick={() => setOpen(!open)}
      >
        Genres {selectedGenres.length > 0 && `(${selectedGenres.length})`}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {genres.map((genre) => (
            <label key={genre} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selectedGenres.includes(genre)}
                onChange={() => toggleGenre(genre)}
              />
              <span>{genre}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenreFilter;
