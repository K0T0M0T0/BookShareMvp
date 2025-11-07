import mongoose, { Schema, Document } from "mongoose";

export interface Chapter {
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
  chapters: Chapter[];
  genres: string[];
  tags: string[];
  uploaderId: string | null;
  rating: number | null;
  coverUrl?: string;
  approved?: boolean;
}

const ChapterSchema = new Schema<Chapter>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    index: { type: Number, required: true },
    createdAt: { type: String },
  },
  { _id: false }
);

const BookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String, required: true },
    chapterAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["finished", "ongoing", "dropped"],
      default: "ongoing",
    },
    chapters: [ChapterSchema],
    genres: [{ type: String }],
    tags: [{ type: String }],
    uploaderId: { type: String, default: null },
    rating: { type: Number, default: null },
    coverUrl: { type: String },
    approved: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IBook>("Book", BookSchema);
