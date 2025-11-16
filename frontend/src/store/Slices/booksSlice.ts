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
import {
  fetchAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../api/booksApi";

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

const initial: Book[] = [];

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

// Add chapter to a book
export const addChapterToBook = createAsyncThunk(
  "books/addChapter",
  async ({
    bookId,
    title,
    content,
    userId,
  }: {
    bookId: string;
    title: string;
    content: string;
    userId?: string;
  }) => {
    // First get the book, add chapter locally, then update
    const books = await fetchAllBooks();
    const book = books.find((b: Book) => b.id === bookId);
    if (!book) throw new Error("Book not found");

    const newChapter = {
      id: nanoid(),
      title,
      content,
      index: book.chapters.length + 1,
      createdAt: new Date().toISOString(),
    };

    const updatedChapters = [...book.chapters, newChapter];
    const updatedBook = await updateBook(bookId, {
      ...book,
      chapters: updatedChapters,
      chapterAmount: updatedChapters.length,
    });

    return { book: updatedBook, chapter: newChapter, userId };
  }
);

// Rate a book
export const rateBookOnServer = createAsyncThunk(
  "books/rate",
  async ({ id, rating }: { id: string; rating: number }) => {
    const books = await fetchAllBooks();
    const book = books.find((b: Book) => b.id === id);
    if (!book) throw new Error("Book not found");

    const newRating =
      book.rating === null ? rating : (book.rating + rating) / 2;

    return await updateBook(id, { ...book, rating: newRating });
  }
);

// Approve a book
export const approveBookOnServer = createAsyncThunk(
  "books/approve",
  async ({ id, adminId }: { id: string; adminId?: string }) => {
    const books = await fetchAllBooks();
    const book = books.find((b: Book) => b.id === id);
    if (!book) throw new Error("Book not found");

    const updated = await updateBook(id, { ...book, approved: true });
    return { book: updated, adminId };
  }
);

// Reject a book
export const rejectBookOnServer = createAsyncThunk(
  "books/reject",
  async ({ id, adminId }: { id: string; adminId?: string }) => {
    const books = await fetchAllBooks();
    const book = books.find((b: Book) => b.id === id);
    if (!book) throw new Error("Book not found");

    const updated = await updateBook(id, { ...book, approved: false });
    return { book: updated, adminId };
  }
);

/* ==========================================================
SECTION 4: Slice Definition
========================================================== */

const booksSlice = createSlice({
  name: "books",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(loadBooks.fulfilled, (_, action) => {
        return action.payload;
      })
      // Save new book
      .addCase(saveBook.fulfilled, (state, action) => {
        state.unshift(action.payload);
      })
      // Edit book
      .addCase(saveBookEdit.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
      })
      // Delete book
      .addCase(removeBookFromServer.fulfilled, (state, action) => {
        const book = state.find((b) => b.id === action.payload);
        if (book) {
          setTimeout(() => {
            (window as any).store?.dispatch(
              addLog({
                type: "book",
                action: `Deleted book "${book.title}"`,
                userId: "unknown",
                targetId: book.id,
                extra: `Author: ${book.author}`,
              })
            );
          });
        }
        return state.filter((b) => b.id !== action.payload);
      })
      // Add chapter
      .addCase(addChapterToBook.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.book.id);
        if (idx >= 0) {
          state[idx] = action.payload.book;
        }
        const logData = {
          bookTitle: action.payload.book.title,
          bookId: action.payload.book.id,
          chapterTitle: action.payload.chapter.title,
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
      })
      // Rate book
      .addCase(rateBookOnServer.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
      })
      // Approve book
      .addCase(approveBookOnServer.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.book.id);
        if (idx >= 0) {
          state[idx] = action.payload.book;
        }
        const logData = action.payload.book;
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
      })
      // Reject book
      .addCase(rejectBookOnServer.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.book.id);
        if (idx >= 0) {
          state[idx] = action.payload.book;
        }
        const logData = action.payload.book;
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
      });
  },
});

/* ==========================================================
SECTION 5: Exports
========================================================== */

export default booksSlice.reducer;
