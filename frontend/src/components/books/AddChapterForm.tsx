/* =========================
File: src/components/books/AddChapterForm.tsx
========================= */
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addChapter } from "../../store/Slices/booksSlice";
import type { AppDispatch } from "../../store/store";
import styles from "./AddChapterForm.module.css";

export default function AddChapterForm({ bookId }: { bookId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(addChapter({ bookId, title, content }));
    setTitle("");
    setContent("");
    navigate("/updates");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <h4 className={styles.title}>Add Chapter</h4>
        <button className={styles.toggleBtn} onClick={() => setOpen((v) => !v)}>
          {open ? "Close" : "Open"}
        </button>
      </div>
      {open && (
        <div className={styles.content}>
          <form onSubmit={submit} className={styles.form}>
            <div>
              <label className={styles.label}>Title</label>
              <input
                className={styles.input}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter title"
                required
              />
            </div>
            <div>
              <label className={styles.label}>Content</label>
              <textarea
                className={styles.textarea}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your chapter content"
                required
              />
            </div>
            <div className={styles.actions}>
              <button className={styles.submitBtn} type="submit">Add</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
