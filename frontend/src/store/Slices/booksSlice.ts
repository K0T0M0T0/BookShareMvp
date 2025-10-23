/* ==========================================================
File: src/store/Slices/booksSlice.ts
Purpose: Manage all book-related state (books, chapters, approvals)
and automatically log important actions for the admin LogsPage.
========================================================== */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { addLog } from "./logsSlice"; // ✅ For tracking actions
import type { AppDispatch } from "../store";

/* ==========================================================
SECTION 1: Data structure definitions
========================================================== */

export interface Chapter {
  id: string;
  title: string;
  content: string;
  index: number;
  createdAt?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  chapterAmount: number;
  status: "finished" | "ongoing" | "dropped";
  chapters: Chapter[];
  genres: string[];
  tags: string[];
  uploaderId: string | null;
  rating: number | null;
  coverUrl?: string;
  approved?: boolean; // ✅ Admin approval required before public display
}

/* ==========================================================
SECTION 2: Initial data setup
========================================================== */
const sample: Book[] = JSON.parse(
  localStorage.getItem("mvp_books") || "null"
) || [
  {
    id: nanoid(),
    title: "Sample: Learn C & React",
    author: "Community",
    description: "A short sample book to showcase the MVP features.",
    chapterAmount: 2,
    status: "ongoing",
    chapters: [
      {
        id: nanoid(),
        title: "Intro",
        content: "Welcome to chapter 1",
        index: 1,
      },
      {
        id: nanoid(),
        title: "Setup",
        content: "Setup instructions in chapter 2",
        index: 2,
      },
    ],
    genres: ["education"],
    tags: ["c", "react"],
    uploaderId: null,
    rating: 4.5,
    approved: true,
  },
];

/* ==========================================================
SECTION 3: Main slice definition
========================================================== */
const booksSlice = createSlice({
  name: "books",
  initialState: sample,
  reducers: {
    /* ========================================================
    ACTION: Add new book
    ======================================================== */
    addBook(
      state,
      action: PayloadAction<Omit<Book, "id" | "chapters" | "chapterAmount">>
    ) {
      const payload = action.payload as any;
      const b: Book = {
        id: nanoid(),
        chapters: [],
        chapterAmount: 0,
        rating: 0,
        approved: false, // not visible until admin approval
        ...payload,
      };
      state.unshift(b);
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },

    /* ========================================================
    ACTION: Edit book info
    ======================================================== */
    editBook(
      state,
      action: PayloadAction<{ id: string; data: Partial<Book> }>
    ) {
      const bk = state.find((b) => b.id === action.payload.id);
      if (bk) Object.assign(bk, action.payload.data);
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },

    /* ========================================================
    ACTION: Remove a book
    ======================================================== */
    removeBook(state, action: PayloadAction<{ id: string; adminId?: string }>) {
      const book = state.find((b) => b.id === action.payload.id);
      const res = state.filter((b) => b.id !== action.payload.id);
      localStorage.setItem("mvp_books", JSON.stringify(res));

      // ✅ Log the removal
      if (book) {
        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "book",
              action: `Deleted book "${book.title}"`,
              userId: action.payload.adminId || "unknown",
              targetId: book.id,
              extra: `Author: ${book.author}`,
            })
          );
        });
      }

      return res;
    },

    /* ========================================================
    ACTION: Add a new chapter
    ======================================================== */
    addChapter(
      state,
      action: PayloadAction<{
        bookId: string;
        title: string;
        content: string;
        userId?: string;
      }>
    ) {
      const book = state.find((b) => b.id === action.payload.bookId);
      if (!book) return;

      const c = {
        id: nanoid(),
        title: action.payload.title,
        content: action.payload.content,
        index: book.chapters.length + 1,
        createdAt: new Date().toISOString(),
      };

      book.chapters.push(c);
      book.chapterAmount = book.chapters.length;
      localStorage.setItem("mvp_books", JSON.stringify(state));

      // ✅ Log chapter creation
      setTimeout(() => {
        (window as any).store?.dispatch(
          addLog({
            type: "chapter",
            action: `Added chapter "${c.title}"`,
            userId: action.payload.userId || "unknown",
            targetId: book.id,
            extra: `Book: ${book.title}`,
          })
        );
      });
    },

    /* ========================================================
    ACTION: Rate book
    ======================================================== */
    rateBook(state, action: PayloadAction<{ id: string; rating: number }>) {
      const b = state.find((x) => x.id === action.payload.id);
      if (!b) return;
      if (b.rating === null) b.rating = action.payload.rating;
      b.rating = (b.rating + action.payload.rating) / 2;
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },

    /* ========================================================
    ACTION: Approve or reject book (admin only)
    ======================================================== */
    approveBook(
      state,
      action: PayloadAction<{ id: string; adminId?: string }>
    ) {
      const b = state.find((x) => x.id === action.payload.id);
      if (b) b.approved = true;
      localStorage.setItem("mvp_books", JSON.stringify(state));

      // ✅ Clone book before async call
      if (b) {
        const logData = { ...b };
        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "book",
              action: `Approved book "${logData.title}"`,
              userId: action.payload.adminId || "unknown",
              targetId: logData.id,
              extra: `Author: ${logData.author}`,
            })
          );
        });
      }
    },

    rejectBook(state, action: PayloadAction<{ id: string; adminId?: string }>) {
      const b = state.find((x) => x.id === action.payload.id);
      if (b) b.approved = false;
      localStorage.setItem("mvp_books", JSON.stringify(state));

      // ✅ Clone book before async call
      if (b) {
        const logData = { ...b };
        setTimeout(() => {
          (window as any).store?.dispatch(
            addLog({
              type: "book",
              action: `Rejected book "${logData.title}"`,
              userId: action.payload.adminId || "unknown",
              targetId: logData.id,
              extra: `Author: ${logData.author}`,
            })
          );
        });
      }
    },
  },
});

/* ==========================================================
SECTION 4: Exports
========================================================== */
export const {
  addBook,
  editBook,
  removeBook,
  addChapter,
  rateBook,
  approveBook,
  rejectBook,
} = booksSlice.actions;

export default booksSlice.reducer;
