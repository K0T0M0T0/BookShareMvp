// backend/src/models/Book.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IChapter {
  id: string;
  title: string;
  content: string;
  index: number;
  createdAt?: string;
}

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  chapterAmount: number;
  status: "finished" | "ongoing" | "dropped";
  chapters: IChapter[];
  genres: string[];
  tags: string[];
  uploaderId: string | null;
  rating: number | null;
  coverUrl?: string;
  approved?: boolean;
}

const ChapterSchema = new Schema<IChapter>({
  id: { type: String, required: true },
  title: String,
  content: String,
  index: Number,
  createdAt: String,
});

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: String,
    description: String,
    chapterAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["finished", "ongoing", "dropped"],
      default: "ongoing",
    },
    chapters: [ChapterSchema],
    genres: [String],
    tags: [String],
    uploaderId: { type: String, default: null },
    rating: { type: Number, default: null },
    coverUrl: String,
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", BookSchema);
