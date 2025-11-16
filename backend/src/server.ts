// backend/src/server.ts
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import bookRoutes from "./routes/booksRoutes";
import userRoutes from "./routes/usersRoutes";
import logsRoutes from "./routes/logsRoutes";
import readingListRoutes from "./routes/readingListsRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// DB Connection
connectDB();

// Routes
app.use("/api/books", bookRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reading-lists", readingListRoutes);
app.use("/api/logs", logsRoutes);

// Default
app.get("/", (_req, res) => res.send("📚 BookShare Backend Running"));

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
