import express from "express";
import {
  getUserCollections,
  createCollection,
  deleteCollection,
  addBookToCollection,
  removeBookFromCollection,
} from "../controllers/collectionsController";
import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:userId", protect, getUserCollections);
router.post("/", protect, createCollection);
router.delete("/:id", protect, deleteCollection);
router.post("/:id/add", protect, addBookToCollection);
router.delete("/:id/remove/:bookId", protect, removeBookFromCollection);

export default router;
