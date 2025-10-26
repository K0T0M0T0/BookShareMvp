import { Request, Response } from "express";

// temporary data before MongoDB
let books = [
  { id: 1, title: "Eve's Diary", author: "Mark Twain", chapters: 5 },
];

export const getAllBooks = (req: Request, res: Response) => {
  res.json(books);
};

export const addBook = (req: Request, res: Response) => {
  const newBook = req.body;
  newBook.id = books.length + 1;
  books.push(newBook);
  res.status(201).json(newBook);
};
