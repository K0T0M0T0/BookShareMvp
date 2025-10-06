/* =========================
File: src/store/booksSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

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
  rating: number;
  coverUrl?: string;
}

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
  },
];

const booksSlice = createSlice({
  name: "books",
  initialState: sample,
  reducers: {
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
    removeBook(state, action: PayloadAction<{ id: string }>) {
      const res = state.filter((b) => b.id !== action.payload.id);
      localStorage.setItem("mvp_books", JSON.stringify(res));
      return res;
    },
    addChapter(
      state,
      action: PayloadAction<{ bookId: string; title: string; content: string }>
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
    },
    rateBook(state, action: PayloadAction<{ id: string; rating: number }>) {
      const b = state.find((x) => x.id === action.payload.id);
      if (!b) return;
      // simple average: newRating = (old + new)/2 - for demo only
      b.rating = (b.rating + action.payload.rating) / 2;
      localStorage.setItem("mvp_books", JSON.stringify(state));
    },
  },
});
export const { addBook, editBook, removeBook, addChapter, rateBook } =
  booksSlice.actions;
export default booksSlice.reducer;
