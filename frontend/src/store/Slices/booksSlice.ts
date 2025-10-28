/* ==========================================================
File: src/store/Slices/booksSlice.ts
Purpose: Manage all book-related state (books, chapters, approvals)
and automatically sync with backend + log important actions.
========================================================== */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";
import { addLog } from "./logsSlice";
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
  approved?: boolean;
}

/* ==========================================================
SECTION 2: Initial Data Setup
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
SECTION 3: Async Thunks (backend connection)
========================================================== */

// Fetch all books from backend
export const loadBooks = createAsyncThunk("books/loadAll", async () => {
  return await fetchAllBooks();
});

// Save new book to backend
export const saveBook = createAsyncThunk(
  "books/save",
  async (book: Omit<Book, "id" | "chapterAmount" | "chapters">) => {
    return await createBook(book);
  }
);

// Update book info
export const saveBookEdit = createAsyncThunk(
  "books/edit",
  async ({ id, data }: { id: string; data: Partial<Book> }) => {
    return await updateBook(id, data);
  }
);

// Delete a book
export const removeBookFromServer = createAsyncThunk(
  "books/remove",
  async (id: string) => {
    return await deleteBook(id);
  }
);

/* ==========================================================
SECTION 4: Slice Definition
========================================================== */

const booksSlice = createSlice({
  name: "books",
  initialState: sample,
  reducers: {
    /* ========================================================
    LOCAL ACTIONS (stay the same)
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
        approved: false,
        ...payload,
      };

      state.unshift(b);
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },

    editBook(
      state,
      action: PayloadAction<{ id: string; data: Partial<Book> }>
    ) {
      const bk = state.find((b) => b.id === action.payload.id);
      if (bk) Object.assign(bk, action.payload.data);
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },

    removeBook(state, action: PayloadAction<{ id: string; adminId?: string }>) {
      const book = state.find((b) => b.id === action.payload.id);
      const res = state.filter((b) => b.id !== action.payload.id);
      localStorage.setItem("mvp_books", JSON.stringify(res));

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

      const logData = {
        bookTitle: book.title,
        bookId: book.id,
        chapterTitle: c.title,
        userId: action.payload.userId || "unknown",
      };

      setTimeout(() => {
        (window as any).store?.dispatch(
          addLog({
            type: "chapter",
            action: `Added chapter "${logData.chapterTitle}"`,
            userId: logData.userId,
            targetId: logData.bookId,
            extra: `Book: ${logData.bookTitle}`,
          })
        );
      });
    },

    rateBook(state, action: PayloadAction<{ id: string; rating: number }>) {
      const b = state.find((x) => x.id === action.payload.id);
      if (!b) return;
      b.rating =
        b.rating === null
          ? action.payload.rating
          : (b.rating + action.payload.rating) / 2;
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },

    approveBook(
      state,
      action: PayloadAction<{ id: string; adminId?: string }>
    ) {
      const b = state.find((x) => x.id === action.payload.id);
      if (b) b.approved = true;
      localStorage.setItem("mvp_books", JSON.stringify(state));

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
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(loadBooks.fulfilled, (_, action) => {
        localStorage.setItem("mvp_books", JSON.stringify(action.payload));
        return action.payload;
      })
      // Save new book
      .addCase(saveBook.fulfilled, (state, action) => {
        state.unshift(action.payload);
        localStorage.setItem("mvp_books", JSON.stringify(state));
      })
      // Edit book
      .addCase(saveBookEdit.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
        localStorage.setItem("mvp_books", JSON.stringify(state));
      })
      // Delete book
      .addCase(removeBookFromServer.fulfilled, (state, action) => {
        const updated = state.filter((b) => b.id !== action.payload);
        localStorage.setItem("mvp_books", JSON.stringify(updated));
        return updated;
      });
  },
});

/* ==========================================================
SECTION 5: Exports
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
