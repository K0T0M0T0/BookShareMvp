import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import clientPromise from "./config/mongoClient";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", async (_req, res) => {
  res.send("📚 BookShareMVP backend running with MongoDB driver!");
});

// Example route: get all books
app.get("/api/books", async (_req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("booksharemvp");
    const books = await db.collection("books").find().toArray();
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Example route: add a book
app.post("/api/books", async (req, res) => {
  try {
    const client = await clientPromise;
    const db = client.db("booksharemvp");
    const result = await db.collection("books").insertOne(req.body);
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding book" });
  }
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
