// File: backend/src/config/db.ts
import { MongoClient, ServerApiVersion, Db } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// 1️⃣ Load connection URI from .env
const uri = process.env.MONGO_URI as string;
if (!uri) {
  throw new Error("❌ MONGO_URI is not defined in .env file");
}

// 2️⃣ Create a single reusable client instance
let client: MongoClient | null = null;
let db: Db | null = null;

// 3️⃣ Connect function that ensures single connection
export async function connectDB(): Promise<Db> {
  if (db) return db; // already connected

  try {
    client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    await client.connect();
    db = client.db("booksharemvp"); // ✅ your main database name

    console.log("✅ Connected to MongoDB (Driver)");
    return db;
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}

// 4️⃣ Optional: helper to get the DB after connected
export function getDB(): Db {
  if (!db) {
    throw new Error("❌ Database not connected. Call connectDB() first.");
  }
  return db;
}
