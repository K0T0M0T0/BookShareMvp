import express from "express";
import { getAllLists } from "../controllers/readingLists.controller";

const router = express.Router();

router.get("/", getAllLists);

export default router; // ✅ Required
