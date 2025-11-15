// backend/src/routes/userRoutes.ts
import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";

import {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
  loginUser,
} from "../controllers/userController"; // ✔ correct filename

const router = express.Router();

router.get("/admin/all", protect, adminOnly, getUsers);
router.put("/admin/:id", protect, adminOnly, updateUser);
router.delete("/admin/:id", protect, adminOnly, deleteUser);

router.post("/login", loginUser); // 👈 LOGIN ROUTE
router.get("/", getUsers);
router.post("/register", registerUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
