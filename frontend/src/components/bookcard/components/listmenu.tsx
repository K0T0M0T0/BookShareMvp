import { forwardRef } from "react";
import styles from "./listmenu.module.scss";
import { Check, Trash, X } from "lucide-react";
import type { BuiltInList } from "../../../store/Slices/readingListsSlice";

type Props = {
  builtInLists: BuiltInList[];
  customLists: string[];
  inList: boolean;
  listName?: string;
  onSelect: (list: string) => void;
  onRemove: () => void;
  onClose: () => void; // ✅ new
};

const ListMenu = forwardRef<HTMLDivElement, Props>(
  (
    {
      builtInLists,
      customLists,
      inList,
      listName,
      onSelect,
      onRemove,
      onClose,
    },
    ref
  ) => {
    return (
      <div
        className={styles.listMenu}
        role="menu"
        ref={ref}
        onClick={(e) => e.stopPropagation()} // ✅ stop click from affecting card
      >
        {/* ✅ Close button (top-right) */}
        <button
          className={styles.closeBtn}
          onClick={(e) => {
            e.stopPropagation(); // prevent triggering card
            onClose();
          }}
          aria-label="Close menu"
          title="Close menu"
        >
          <X size={16} />
        </button>

        <div className={styles.menuSection}>
          <div className={styles.menuHeader}>Quick actions</div>
          <button className={styles.menuItem} onClick={() => onSelect("later")}>
            <span>Add to Later</span>
            {listName === "later" && <Check size={14} />}
          </button>

          {inList && (
            <button className={styles.menuItem} onClick={onRemove}>
              <span>Remove from list</span>
              <Trash size={14} />
            </button>
          )}
        </div>

        <div className={styles.menuSection}>
          <div className={styles.menuHeader}>Built-in lists</div>
          {builtInLists.map((l) => (
            <button
              key={l}
              className={styles.menuItem}
              onClick={() => onSelect(l)}
            >
              <span>{l[0].toUpperCase() + l.slice(1)}</span>
              {listName === l && <Check size={14} />}
            </button>
          ))}
        </div>

        {customLists.length > 0 && (
          <div className={styles.menuSection}>
            <div className={styles.menuHeader}>Your collections</div>
            {customLists.map((n) => (
              <button
                key={n}
                className={styles.menuItem}
                onClick={() => onSelect(n)}
              >
                <span>{n}</span>
                {listName === n && <Check size={14} />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
);

export default ListMenu;
