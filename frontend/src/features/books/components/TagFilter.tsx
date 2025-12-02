import React, { useState } from "react";
import styles from "../../../styles/components/books/FilterSelect.module.scss";

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onChange: (selected: string[]) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleTag = (tag: string) => {
    onChange(
      selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag]
    );
  };

  return (
    <div className={styles.filterBox}>
      <button
        type="button"
        className={styles.filterToggle}
        onClick={() => setOpen(!open)}
      >
        Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
      </button>

      {open && (
        <div className={styles.dropdown}>
          {tags.map((tag) => (
            <label key={tag} className={styles.checkboxItem}>
              <input
                type="checkbox"
                checked={selectedTags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default TagFilter;
