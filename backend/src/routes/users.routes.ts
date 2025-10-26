import express from "express";
import { getAllUsers } from "../controllers/users.controller";

const router = express.Router();

// Example route
router.get("/", getAllUsers);

export default router; // ✅ THIS IS MANDATORY
