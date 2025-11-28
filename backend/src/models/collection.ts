import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollection extends Document {
  userId: string;
  name: string;
}

const collectionSchema = new Schema<ICollection>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
});

const Collection: Model<ICollection> = mongoose.model<ICollection>(
  "Collection",
  collectionSchema
);

export default Collection;
