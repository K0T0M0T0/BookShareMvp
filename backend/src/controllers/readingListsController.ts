// backend/src/controllers/readingListController.ts
import { Request, Response } from "express";
import ReadingList from "../models/ReadingList";

// Get user's reading list
export const getReadingLists = async (req: Request, res: Response) => {
  try {
    const lists = await ReadingList.find({ userId: req.params.userId });
    res.json(lists);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch reading lists", error: err });
  }
};

// Add or move a book to list
export const addToList = async (req: Request, res: Response) => {
  try {
    const { userId, bookId, list } = req.body;
    const existing = await ReadingList.findOne({ userId, bookId });
    if (existing) {
      existing.list = list;
      await existing.save();
      return res.json(existing);
    }
    const newEntry = await ReadingList.create({ userId, bookId, list });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ message: "Failed to add to list", error: err });
  }
};

// Remove a book from list
export const removeFromList = async (req: Request, res: Response) => {
  try {
    const { userId, bookId } = req.params;
    await ReadingList.findOneAndDelete({ userId, bookId });
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove", error: err });
  }
};
