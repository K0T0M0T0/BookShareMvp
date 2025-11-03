// backend/src/models/ReadingList.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IReadingList extends Document {
  userId: string;
  bookId: string;
  list: string; // "reading", "completed", etc.
}

const ReadingListSchema = new Schema<IReadingList>(
  {
    userId: { type: String, required: true },
    bookId: { type: String, required: true },
    list: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IReadingList>("ReadingList", ReadingListSchema);
