import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchCollections,
  createCollection,
  addBookToCollection,
  removeBookFromCollection,
} from "../../api/collectionsApi";

export interface Collection {
  id: string;
  userId: string;
  name: string;
  books: string[];
}

const initial: Collection[] = [];

export const loadCollections = createAsyncThunk(
  "collections/load",
  async (userId: string) => fetchCollections(userId)
);

export const createCollectionThunk = createAsyncThunk(
  "collections/create",
  async ({ userId, name }: { userId: string; name: string }) =>
    createCollection(userId, name)
);

export const addBookToCollectionThunk = createAsyncThunk(
  "collections/addBook",
  async ({ collectionId, bookId }: { collectionId: string; bookId: string }) =>
    addBookToCollection(collectionId, bookId)
);

export const removeBookFromCollectionThunk = createAsyncThunk(
  "collections/removeBook",
  async ({ collectionId, bookId }: { collectionId: string; bookId: string }) =>
    removeBookFromCollection(collectionId, bookId)
);

const collectionsSlice = createSlice({
  name: "collections",
  initialState: initial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCollections.fulfilled, (_, action) => action.payload)
      .addCase(createCollectionThunk.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(addBookToCollectionThunk.fulfilled, (state, action) => {
        const c = state.find((x) => x.id === action.payload.collectionId);
        if (c && !c.books.includes(action.payload.bookId))
          c.books.push(action.payload.bookId);
      })
      .addCase(removeBookFromCollectionThunk.fulfilled, (state, action) => {
        const c = state.find((x) => x.id === action.payload.collectionId);
        if (c) {
          c.books = c.books.filter((b) => b !== action.payload.bookId);
        }
      });
  },
});

export default collectionsSlice.reducer;
