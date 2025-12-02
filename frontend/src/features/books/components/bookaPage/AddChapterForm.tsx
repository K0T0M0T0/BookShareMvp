/* =========================
File: src/components/books/AddChapterForm.tsx
========================= */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addChapterToBook } from "../../../../store/Slices/booksSlice";
import { useAppDispatch, useAppSelector } from "../../../../app/hooks";
import styles from "../../../../styles/components/books/AddChapterForm.module.scss";

export default function AddChapterForm({ bookId }: { bookId: string }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const session = useAppSelector((s) => s.session);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    setLoading(true);
    try {
      await dispatch(
        addChapterToBook({
          bookId,
          title,
          content,
          userId: session.userId || "",
        })
      ).unwrap();
      setTitle("");
      setContent("");
      navigate("/books/" + bookId);
    } catch (err) {
      alert("Failed to add chapter");
      setLoading(false);
    }
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
              <button
                className={styles.submitBtn}
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
