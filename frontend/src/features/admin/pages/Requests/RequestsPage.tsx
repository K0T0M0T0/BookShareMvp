/* =========================
File: src/features/admin/pages/Requests/RequestsPage.tsx
========================= */
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../../../store/store";
import {
  approveBookOnServer,
  rejectBookOnServer,
} from "../../../../store/Slices/booksSlice";
import styles from "./RequestsPage.module.scss";

export default function RequestsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const books = useSelector((s: RootState) => s.books);
  const adminId = useSelector((s: RootState) => s.session.userId) ?? undefined;

  // Filter out only pending (unapproved) books
  const pendingBooks = books.filter((b) => !b.approved);

  const approve = (id: string) => {
    dispatch(approveBookOnServer({ id, adminId }));
  };

  const reject = (id: string) => {
    dispatch(rejectBookOnServer({ id, adminId }));
  };

  return (
    <div className={styles.container}>
      <h2>Book Publication Requests</h2>

      {pendingBooks.length === 0 ? (
        <p className={styles.empty}>No pending book requests 🎉</p>
      ) : (
        pendingBooks.map((b) => (
          <div key={b.id} className={styles.card}>
            <h3>{b.title}</h3>
            <p>by {b.author}</p>
            <div className={styles.actions}>
              <button onClick={() => approve(b.id)}>Approve</button>
              <button onClick={() => reject(b.id)}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
