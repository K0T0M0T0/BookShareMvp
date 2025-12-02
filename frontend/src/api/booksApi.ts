/* ==========================================================
File: src/api/booksApi.ts
Purpose: Talk with backend /api/books endpoints with JWT auth.
========================================================== */

import apiClient from "./axiosInstance";
import type { Book } from "../store/Slices/booksSlice"; // type-only import

const BOOKS_PATH = "/books";

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
  const res = await apiClient.get<Book[]>(BOOKS_PATH, {
    headers: authHeader(token),
  });
  return res.data.map(mapBook);
};

// POST /api/books
export const createBook = async (
  book: Omit<Book, "id" | "chapterAmount" | "chapters">,
  token: string | null
): Promise<Book> => {
  const res = await apiClient.post(BOOKS_PATH, book, {
    headers: authHeader(token),
  });
  return mapBook(res.data);
};
// POST /api/books/:id/rating
export async function rateBook(bookId: string, rating: number): Promise<Book> {
  const res = await apiClient.post(`${BOOKS_PATH}/${bookId}/rating`, {
    rating,
  });
  return mapBook(res.data);
}
// PUT /api/books/:id
export const updateBook = async (
  id: string,
  data: Partial<Book>,
  token: string | null
): Promise<Book> => {
  const res = await apiClient.put(`${BOOKS_PATH}/${id}`, data, {
    headers: authHeader(token),
  });
  return mapBook(res.data);
};

// DELETE /api/books/:id
export const deleteBook = async (
  id: string,
  token: string | null
): Promise<string> => {
  await apiClient.delete(`${BOOKS_PATH}/${id}`, {
    headers: authHeader(token),
  });
  return id;
};
