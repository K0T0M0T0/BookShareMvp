/* ==========================================================
File: src/store/Slices/booksSlice.ts
Purpose: Manage all book-related state (books, chapters, approvals)
and automatically sync with backend + log important actions.
========================================================== */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

import {
  fetchAllBooks,
  createBook,
  updateBook,
  deleteBook,
} from "../../api/booksApi";

import { addLogToServer } from "./logsSlice";
import type { RootState, AppDispatch } from "../store";

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
export const loadBooks = createAsyncThunk<Book[], void, { state: RootState }>(
  "books/loadAll",
  async (_, { getState }) => {
    const token = getState().session.token;
    return await fetchAllBooks(token || null);
  }
);

// Save new book to backend
export const saveBook = createAsyncThunk<
  Book,
  Omit<Book, "id" | "chapterAmount" | "chapters">,
  { state: RootState; dispatch: AppDispatch }
>("books/save", async (book, { getState, dispatch }) => {
  const token = getState().session.token;
  const created = await createBook(book, token || null);

  // Optional: log creation
  const userId = getState().session.userId || "unknown";
  await dispatch(
    addLogToServer({
      type: "book",
      action: `Created book "${created.title}"`,
      userId,
      targetId: created.id,
      extra: `Author: ${created.author}`,
    })
  );

  return created;
});

// Update book info
export const saveBookEdit = createAsyncThunk<
  Book,
  { id: string; data: Partial<Book> },
  { state: RootState }
>("books/edit", async ({ id, data }, { getState }) => {
  const token = getState().session.token;
  return await updateBook(id, data, token || null);
});

// Delete a book + log
export const removeBookFromServer = createAsyncThunk<
  string,
  string,
  { state: RootState; dispatch: AppDispatch }
>("books/remove", async (id, { getState, dispatch }) => {
  const state = getState();
  const token = state.session.token;
  const userId = state.session.userId || "unknown";

  // Grab book info from current state BEFORE deleting (for logging)
  const book = state.books.find((b) => b.id === id);

  await deleteBook(id, token || null);

  if (book) {
    await dispatch(
      addLogToServer({
        type: "book",
        action: `Deleted book "${book.title}"`,
        userId,
        targetId: book.id,
        extra: `Author: ${book.author}`,
      })
    );
  }

  return id;
});

// Add chapter to a book + log
export const addChapterToBook = createAsyncThunk<
  { book: Book; chapter: Chapter; userId?: string },
  {
    bookId: string;
    title: string;
    content: string;
    userId?: string;
  },
  { state: RootState; dispatch: AppDispatch }
>("books/addChapter", async ({ bookId, title, content, userId }, thunkApi) => {
  const { getState, dispatch } = thunkApi;
  const token = getState().session.token;

  // We can use current state or refetch; here we refetch to be safe:
  const allBooks = await fetchAllBooks(token || null);
  const book = allBooks.find((b: Book) => b.id === bookId);
  if (!book) throw new Error("Book not found");

  const newChapter: Chapter = {
    id: nanoid(),
    title,
    content,
    index: book.chapters.length + 1,
    createdAt: new Date().toISOString(),
  };

  const updatedChapters = [...book.chapters, newChapter];
  const updatedBook = await updateBook(
    bookId,
    {
      ...book,
      chapters: updatedChapters,
      chapterAmount: updatedChapters.length,
    },
    token || null
  );

  // Log the new chapter
  await dispatch(
    addLogToServer({
      type: "chapter",
      action: `Added chapter "${newChapter.title}"`,
      userId: userId || getState().session.userId || "unknown",
      targetId: updatedBook.id,
      extra: `Book: ${updatedBook.title}`,
    })
  );

  return { book: updatedBook, chapter: newChapter, userId };
});

// Rate a book
export const rateBookOnServer = createAsyncThunk<
  Book,
  { id: string; rating: number },
  { state: RootState }
>("books/rate", async ({ id, rating }, { getState }) => {
  const token = getState().session.token;
  const books = await fetchAllBooks(token || null);
  const book = books.find((b: Book) => b.id === id);
  if (!book) throw new Error("Book not found");

  const newRating = book.rating === null ? rating : (book.rating + rating) / 2;

  return await updateBook(id, { ...book, rating: newRating }, token || null);
});

// Approve a book + log
export const approveBookOnServer = createAsyncThunk<
  { book: Book; adminId?: string },
  { id: string; adminId?: string },
  { state: RootState; dispatch: AppDispatch }
>("books/approve", async ({ id, adminId }, { getState, dispatch }) => {
  const token = getState().session.token;
  const books = await fetchAllBooks(token || null);
  const book = books.find((b: Book) => b.id === id);
  if (!book) throw new Error("Book not found");

  const updated = await updateBook(
    id,
    { ...book, approved: true },
    token || null
  );

  await dispatch(
    addLogToServer({
      type: "book",
      action: `Approved book "${updated.title}"`,
      userId: adminId || getState().session.userId || "unknown",
      targetId: updated.id,
      extra: `Author: ${updated.author}`,
    })
  );

  return { book: updated, adminId };
});

// Reject a book + log
export const rejectBookOnServer = createAsyncThunk<
  { book: Book; adminId?: string },
  { id: string; adminId?: string },
  { state: RootState; dispatch: AppDispatch }
>("books/reject", async ({ id, adminId }, { getState, dispatch }) => {
  const token = getState().session.token;
  const books = await fetchAllBooks(token || null);
  const book = books.find((b: Book) => b.id === id);
  if (!book) throw new Error("Book not found");

  const updated = await updateBook(
    id,
    { ...book, approved: false },
    token || null
  );

  await dispatch(
    addLogToServer({
      type: "book",
      action: `Rejected book "${updated.title}"`,
      userId: adminId || getState().session.userId || "unknown",
      targetId: updated.id,
      extra: `Author: ${updated.author}`,
    })
  );

  return { book: updated, adminId };
});

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
        return state.filter((b) => b.id !== action.payload);
      })

      // Add chapter
      .addCase(addChapterToBook.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.book.id);
        if (idx >= 0) state[idx] = action.payload.book;
      })

      // Rate book
      .addCase(rateBookOnServer.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.id);
        if (idx >= 0) state[idx] = action.payload;
      })

      // Approve book
      .addCase(approveBookOnServer.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.book.id);
        if (idx >= 0) state[idx] = action.payload.book;
      })

      // Reject book
      .addCase(rejectBookOnServer.fulfilled, (state, action) => {
        const idx = state.findIndex((b) => b.id === action.payload.book.id);
        if (idx >= 0) state[idx] = action.payload.book;
      });
  },
});

/* ==========================================================
SECTION 5: Exports
========================================================== */

export default booksSlice.reducer;
