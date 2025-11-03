// backend/src/routes/readingListRoutes.ts
import express from "express";
import {
  getReadingLists,
  addToList,
  removeFromList,
} from "../controllers/readingListsController";

const router = express.Router();

router.get("/:userId", getReadingLists);
router.post("/", addToList);
router.delete("/:userId/:bookId", removeFromList);

export default router;
