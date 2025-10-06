/* =========================
File: src/store/booksSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { nanoid } from "nanoid";

// Book and Chapter interfaces
export interface Chapter {
  id: string;
  title: string;
  content: string;
  index: number;
}
export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  status: "finished" | "ongoing" | "dropped";
  chapters: Chapter[];
  genres: string[];
  tags: string[];
  uploaderId: string | null;
}

const initialState: Book[] = JSON.parse(localStorage.getItem("books") || "[]");

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    addBook: (state, action: PayloadAction<Omit<Book, "id" | "chapters">>) => {
      const newBook: Book = { id: nanoid(), chapters: [], ...action.payload };
      state.unshift(newBook);
      localStorage.setItem("books", JSON.stringify(state));
    },
    addChapter: (
      state,
      action: PayloadAction<{ bookId: string; title: string; content: string }>
    ) => {
      const { bookId, title, content } = action.payload;
      const book = state.find((b) => b.id === bookId);
      if (book) {
        const newChap: Chapter = {
          id: nanoid(),
          title,
          content,
          index: book.chapters.length + 1,
        };
        book.chapters.push(newChap);
      }
      localStorage.setItem("books", JSON.stringify(state));
    },
  },
});

export const { addBook, addChapter } = booksSlice.actions;
export default booksSlice.reducer;
