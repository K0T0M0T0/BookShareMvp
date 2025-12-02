import { Request, Response } from "express";
import Book from "../models/book"; // ✅ your Mongoose model

// Helper: map Mongo document → frontend shape (id instead of _id)
const mapBook = (b: any) => ({
  ...b,
  id: b._id.toString(),
});

export const getBooks = async (_req: Request, res: Response) => {
  try {
    const books = await Book.find().lean();
    res.json(books.map(mapBook));
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch books", error: err.message });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await Book.findById(req.params.id).lean();
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    res.json(mapBook(book));
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch book", error: err.message });
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    const created = await Book.create(req.body);
    const obj = created.toObject();
    res.status(201).json(mapBook(obj));
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to create book", error: err.message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    // ✅ IMPORTANT: use Mongo _id via findByIdAndUpdate
    const updated = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).lean();

    if (!updated) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(mapBook(updated));
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to update book", error: err.message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    const deleted = await Book.findByIdAndDelete(req.params.id).lean();

    if (!deleted) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ id: deleted._id.toString(), message: "Book removed" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to delete book", error: err.message });
  }
};
export const rateBook = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    const parsedRating = Number(rating);

    // basic validation
    if (
      typeof parsedRating !== "number" ||
      Number.isNaN(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 1 and 5" });
    }

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // running average: newAvg = (oldAvg * count + newRating) / (count + 1)
    const currentAvg = book.rating ?? 0;
    const currentCount = book.ratingsCount ?? 0;

    const newCount = currentCount + 1;
    const newAvg = (currentAvg * currentCount + parsedRating) / newCount;

    book.rating = newAvg;
    book.ratingsCount = newCount;

    await book.save();
    const obj = book.toObject();

    // ✅ use _id here, or just reuse mapBook
    res.json(mapBook(obj));
  } catch (err: any) {
    console.error("rateBook error:", err); // add this for debugging
    res
      .status(500)
      .json({ message: "Failed to rate book", error: err.message });
  }
};
