import { Request, Response } from "express";

export const getAllLists = (req: Request, res: Response) => {
  res.json([
    { id: 1, userId: 1, bookId: 2, list: "reading" },
    { id: 2, userId: 1, bookId: 3, list: "completed" },
  ]);
};
