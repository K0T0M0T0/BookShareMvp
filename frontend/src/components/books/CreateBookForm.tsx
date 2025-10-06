/* =========================
File: src/components/books/CreateBookForm.tsx
========================= */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addBook } from "../../store/Slices/booksSlice";
import type { AppDispatch, RootState } from "../../store/store";
import styles from "./CreateBookForm.module.css";

export default function CreateBookForm() {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((s: RootState) => s.session);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [genres, setGenres] = useState("");
  const [tags, setTags] = useState("");
  const [coverUrl, setCoverUrl] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      addBook({
        rating: 0,
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
    );
    setTitle("");
    setAuthor("");
    setDescription("");
    setGenres("");
    setTags("");
    setCoverUrl("");
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2 className={styles.title}>Create Book</h2>
        <p className={styles.subtitle}>Add a new book to your library</p>
        {coverUrl ? (
          <img className={`${styles.preview} ${styles.full}`} src={coverUrl} alt="Cover preview" />
        ) : (
          <div className={`${styles.preview} ${styles.full}`} />
        )}
        <form className={styles.form} onSubmit={submit}>
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
            <button className={styles.button} type="submit">Create</button>
          </div>
        </form>
      </div>
    </div>
  );
}
