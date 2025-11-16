import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware";
import { createLog, getLogs, deleteLogs } from "../controllers/logsController";

const router = express.Router();

router.get("/", protect, adminOnly, getLogs);
router.post("/", protect, createLog);
router.delete("/", protect, adminOnly, deleteLogs);

export default router;
