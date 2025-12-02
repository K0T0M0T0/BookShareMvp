import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  rateBook,
} from "../controllers/booksController";

const router = express.Router();

// Public: list + single
router.get("/", getBooks);
router.get("/:id", getBookById);
router.post("/:id/rating", protect, rateBook);
// Logged in user can create
router.post("/", protect, createBook);

// Only admin can update / delete
router.put("/:id", protect, adminOnly, updateBook);
router.delete("/:id", protect, adminOnly, deleteBook);

export default router;
