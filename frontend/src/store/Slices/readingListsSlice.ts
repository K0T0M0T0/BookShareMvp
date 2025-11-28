/* ==========================================================
File: src/store/Slices/readingListsSlice.ts
Purpose: This file keeps track of which books each user
has saved to different lists — such as "reading", "completed",
"later", or even their own custom list.
========================================================== */

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchUserReadingLists,
  addBookToList,
  removeBookFromList,
} from "../../api/readingListsApi";

/* ==========================================================
SECTION 1: Types and Data Structure
========================================================== */

/*
These are the built-in list categories users can assign books to.
They describe a book's status in the user's personal library.
*/
export type BuiltInList = "completed" | "later" | "reading" | "dropped";

/*
Each "ReadingListEntry" represents one connection between
a user and a book — showing which list that book belongs to.
*/
export interface ReadingListEntry {
  userId: string; // The ID of the person who owns this list
  bookId: string; // The ID of the book being saved
  list: BuiltInList | string; // The list name (can be built-in or custom)
}

/* ==========================================================
SECTION 2: Load Existing Data
========================================================== */

const initial: ReadingListEntry[] = [];

/* ==========================================================
SECTION 3: Async Thunks
========================================================== */

export const loadReadingLists = createAsyncThunk(
  "readingLists/load",
  async (userId: string) => {
    return await fetchUserReadingLists(userId);
  }
);

export const addToListThunk = createAsyncThunk(
  "readingLists/add",
  async (data: {
    userId: string;
    bookId: string;
    list: BuiltInList | string;
  }) => {
    return await addBookToList(data);
  }
);

export const removeFromListThunk = createAsyncThunk(
  "readingLists/remove",
  async ({ userId, bookId }: { userId: string; bookId: string }) => {
    await removeBookFromList(userId, bookId);
    return { userId, bookId };
  }
);

/* ==========================================================
SECTION 4: The Main Slice
========================================================== */

const readingListsSlice = createSlice({
  name: "readingLists", // Unique name for this slice
  initialState: initial, // Starting data
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadReadingLists.fulfilled, (_, action) => {
        return action.payload;
      })
      .addCase(addToListThunk.fulfilled, (state, action) => {
        const { userId, bookId } = action.payload;
        // Check if this user already has this book in any list
        const existing = state.find(
          (e) => e.userId === userId && e.bookId === bookId
        );
        if (existing) {
          // If found, update the list name
          existing.list = action.payload.list;
        } else {
          // Otherwise, create a new list entry
          state.push(action.payload);
        }
      })
      .addCase(removeFromListThunk.fulfilled, (state, action) => {
        return state.filter(
          (e) =>
            !(
              e.userId === action.payload.userId &&
              e.bookId === action.payload.bookId
            )
        );
      });
  },
});

/* ==========================================================
SECTION 5: Export Actions and Reducer
========================================================== */

// The reducer is the main data manager that the app uses to track reading lists.
export default readingListsSlice.reducer;
