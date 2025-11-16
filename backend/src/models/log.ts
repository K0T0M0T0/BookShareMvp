import mongoose, { Schema, Document } from "mongoose";

export interface ILog extends Document {
  type: string;
  action: string;
  userId: string;
  targetId?: string;
  timestamp: string;
  extra?: string;
}

const LogSchema = new Schema<ILog>(
  {
    type: { type: String, required: true },
    action: { type: String, required: true },
    userId: { type: String, required: true },
    targetId: { type: String },
    timestamp: { type: String, required: true },
    extra: { type: String },
  },
  { timestamps: false }
);

export default mongoose.model<ILog>("Log", LogSchema);
