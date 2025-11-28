import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICollectionEntry extends Document {
  collectionId: string;
  bookId: string;
}

const collectionEntrySchema = new Schema<ICollectionEntry>({
  collectionId: { type: String, required: true, index: true },
  bookId: { type: String, required: true },
});

const CollectionEntry: Model<ICollectionEntry> =
  mongoose.model<ICollectionEntry>("CollectionEntry", collectionEntrySchema);

export default CollectionEntry;
