import { Request, Response } from "express";
import Collection from "../models/collection";
import CollectionEntry from "../models/collectionEntry";

export interface CollectionDto {
  id: string;
  userId: string;
  name: string;
  books: string[];
}

// GET /api/collections/:userId
export const getUserCollections = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const collections = await Collection.find({ userId }).lean();
    const collectionIds = collections.map((c) => c._id.toString());

    const entries = await CollectionEntry.find({
      collectionId: { $in: collectionIds },
    }).lean();

    const result: CollectionDto[] = collections.map((c) => ({
      id: c._id.toString(),
      userId: c.userId,
      name: c.name,
      books: entries
        .filter((e) => e.collectionId === c._id.toString())
        .map((e) => e.bookId),
    }));

    res.json(result);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to fetch collections", error: err.message });
  }
};

// POST /api/collections  { userId, name }
export const createCollection = async (req: Request, res: Response) => {
  try {
    const { userId, name } = req.body;

    if (!userId || !name) {
      return res.status(400).json({ message: "userId and name are required" });
    }

    const exists = await Collection.findOne({ userId, name });
    if (exists) {
      return res.status(400).json({ message: "Collection already exists" });
    }

    const created = await Collection.create({ userId, name });

    const result: CollectionDto = {
      id: String(created._id),
      userId: created.userId,
      name: created.name,
      books: [],
    };

    res.status(201).json(result);
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to create collection", error: err.message });
  }
};

// DELETE /api/collections/:id
export const deleteCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await Collection.findByIdAndDelete(id);
    await CollectionEntry.deleteMany({ collectionId: id });

    res.json({ message: "Collection deleted" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to delete collection", error: err.message });
  }
};

// POST /api/collections/:id/add  { bookId }
export const addBookToCollection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: "bookId is required" });
    }

    const exists = await CollectionEntry.findOne({ collectionId: id, bookId });
    if (exists) {
      return res.status(400).json({ message: "Book already in collection" });
    }

    const entry = await CollectionEntry.create({ collectionId: id, bookId });

    res.status(201).json({
      id: String(entry._id),
      collectionId: entry.collectionId,
      bookId: entry.bookId,
    });
  } catch (err: any) {
    res.status(500).json({ message: "Failed to add book", error: err.message });
  }
};

// DELETE /api/collections/:id/remove/:bookId
export const removeBookFromCollection = async (req: Request, res: Response) => {
  try {
    const { id, bookId } = req.params;

    await CollectionEntry.findOneAndDelete({ collectionId: id, bookId });

    res.json({ message: "Removed" });
  } catch (err: any) {
    res
      .status(500)
      .json({ message: "Failed to remove book", error: err.message });
  }
};
