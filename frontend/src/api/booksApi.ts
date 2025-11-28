/* ==========================================================
File: src/api/booksApi.ts
Purpose: Talk with backend /api/books endpoints with JWT auth.
========================================================== */

import axios from "axios";
import type { Book } from "../store/Slices/booksSlice"; // type-only import

const API_URL = "http://localhost:5000/api/books";

const authHeader = (token: string | null) =>
  token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};

/* ==========================================================
Helper: normalize backend book → frontend Book
========================================================== */

// Backend sends: { _id: "...", ... }
// Frontend wants: { id: "...", ... }
const mapBook = (b: any): Book => {
  return {
    ...b,
    id: b.id ?? b._id, // ✅ always ensure `id` exists
  } as Book;
};

/* ==========================================================
SECTION 1: API functions
========================================================== */

// GET /api/books
export const fetchAllBooks = async (token: string | null): Promise<Book[]> => {
  const res = await axios.get(API_URL, {
    headers: authHeader(token),
  });
  const raw = res.data as any[];
  return raw.map(mapBook);
};

// POST /api/books
export const createBook = async (
  book: Omit<Book, "id" | "chapterAmount" | "chapters">,
  token: string | null
): Promise<Book> => {
  const res = await axios.post(API_URL, book, {
    headers: authHeader(token),
  });
  return mapBook(res.data);
};

// PUT /api/books/:id
export const updateBook = async (
  id: string,
  data: Partial<Book>,
  token: string | null
): Promise<Book> => {
  const res = await axios.put(`${API_URL}/${id}`, data, {
    headers: authHeader(token),
  });
  return mapBook(res.data);
};

// DELETE /api/books/:id
export const deleteBook = async (
  id: string,
  token: string | null
): Promise<string> => {
  await axios.delete(`${API_URL}/${id}`, {
    headers: authHeader(token),
  });
  return id;
};
