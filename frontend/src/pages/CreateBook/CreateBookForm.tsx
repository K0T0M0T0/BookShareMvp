/* =========================
File: src/components/books/CreateBookForm.tsx
========================= */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveBook } from "../../store/Slices/booksSlice";
import type { AppDispatch, RootState } from "../../store/store";
import styles from "./CreateBookForm.module.css";
import { useNavigate } from "react-router-dom";

export default function CreateBookForm() {
  // Redux
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((s: RootState) => s.session);
  // Form state
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handlers
  //sumbit
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    // Basic validation
    if (!title.trim() || !author.trim()) {
      setError("Title and Author are required.");
      return;
    }
    setLoading(true);
    try {
      // call saveBook async thunk
      await dispatch(
        saveBook({
          rating: null,
          title,
          author,
          description,
          status: "ongoing",
          coverUrl: coverUrl || undefined,
          genres: genres
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          tags: tags
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          uploaderId: session.userId,
        })
      ).unwrap();
      // Reset form
      setTitle("");
      setAuthor("");
      setDescription("");
      setGenres("");
      setTags("");
      setCoverUrl("");
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Failed to create book");
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Book</h2>
        <p className={styles.subtitle}>Add a new book to your library</p>
        {coverUrl ? (
          <img
            className={`${styles.bookCover} ${styles.full}`}
            src={coverUrl}
            alt="Cover preview"
          />
        ) : (
          <div className={`${styles.bookCover} ${styles.full}`} />
        )}
        <form className={styles.form} onSubmit={submit}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <div className={styles.full}>
            <label className={styles.label}>Cover image URL</label>
            <input
              className={styles.input}
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              placeholder="https://... (optional)"
            />
          </div>
          <div>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Book title"
              required
            />
          </div>
          <div>
            <label className={styles.label}>Author</label>
            <input
              className={styles.input}
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
              required
            />
          </div>
          <div className={styles.full}>
            <label className={styles.label}>Description</label>
            <textarea
              className={styles.textarea}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description"
              required
            />
          </div>
          <div>
            <label className={styles.label}>Genres</label>
            <input
              className={styles.input}
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
              placeholder="e.g. fantasy, adventure"
            />
          </div>
          <div>
            <label className={styles.label}>Tags</label>
            <input
              className={styles.input}
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="comma separated tags"
            />
          </div>
          <div className={`${styles.btnRow} ${styles.full}`}>
            <button className={styles.button} type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
