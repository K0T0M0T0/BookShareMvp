// backend/src/routes/userRoutes.ts
import express from "express";
import {
  registerUser,
  getUsers,
  updateUser,
  deleteUser,
} from "../controllers/usersController";

const router = express.Router();

router.get("/", getUsers);
router.post("/", registerUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
