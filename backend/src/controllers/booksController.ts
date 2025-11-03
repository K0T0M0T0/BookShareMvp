// backend/src/controllers/bookController.ts
import { Request, Response } from "express";
import Book from "../models/book";

// Get all books
export const getAllBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch books", error: err });
  }
};

// Create a book
export const createBook = async (req: Request, res: Response) => {
  try {
    const newBook = await Book.create(req.body);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(400).json({ message: "Failed to create book", error: err });
  }
};

// Update a book
export const updateBook = async (req: Request, res: Response) => {
  try {
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Book not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update book", error: err });
  }
};

// Delete a book
export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.json({ id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete book", error: err });
  }
};
