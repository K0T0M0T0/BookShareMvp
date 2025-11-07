import { Request, Response } from "express";
import Book from "../models/book";

/* ==========================================================
   Get all books
   (optionally only approved if ?approved=true)
========================================================== */
export const getBooks = async (req: Request, res: Response) => {
  try {
    const filter = req.query.approved === "true" ? { approved: true } : {};
    const books = await Book.find(filter);
    res.status(200).json(books);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: err.message });
  }
};

/* ==========================================================
   Create a new book
========================================================== */
export const createBook = async (req: Request, res: Response) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to create book", error: err.message });
  }
};

/* ==========================================================
   Update existing book
========================================================== */
export const updateBook = async (req: Request, res: Response) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to update book", error: err.message });
  }
};

/* ==========================================================
   Delete a book
========================================================== */
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.json({ id: req.params.id });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to delete book", error: err.message });
  }
};
