/* ==========================================================
File: src/store/Slices/readingListsSlice.ts
Purpose: This file keeps track of which books each user
has saved to different lists — such as "reading", "completed",
"later", or even their own custom list.
========================================================== */

import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/* ==========================================================
SECTION 1: Types and Data Structure
========================================================== */

/*
These are the built-in list categories users can assign books to.
They describe a book’s status in the user’s personal library.
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

/*
Try to load saved reading lists from local storage.
If none exist, start with an empty list.
*/
const initial: ReadingListEntry[] = JSON.parse(
  localStorage.getItem("mvp_reading_lists") || "[]"
);

/* ==========================================================
SECTION 3: The Main Slice
========================================================== */

const readingListsSlice = createSlice({
  name: "readingLists", // Unique name for this slice
  initialState: initial, // Starting data
  reducers: {
    /* ========================================================
    ACTION: Add or Move a Book to a List
    ----------------------------------------------------------
    - If the book already exists in one of the user’s lists,
      it updates the list name (e.g., moves from “reading” to “completed”).
    - If it doesn’t exist yet, it adds a new entry.
    ======================================================== */
    addToList(
      state,
      action: PayloadAction<{
        userId: string;
        bookId: string;
        list: BuiltInList | string;
      }>
    ) {
      const { userId, bookId, list } = action.payload;

      // Check if this user already has this book in any list
      const existing = state.find(
        (e) => e.userId === userId && e.bookId === bookId
      );

      if (existing) {
        // If found, simply update the list name
        existing.list = list;
      } else {
        // Otherwise, create a new list entry for this user-book combo
        state.push({ userId, bookId, list });
      }

      // Save the updated list for future sessions
      localStorage.setItem("mvp_reading_lists", JSON.stringify(state));
    },

    /* ========================================================
    ACTION: Remove a Book from Lists
    ----------------------------------------------------------
    Deletes a book from the user’s reading lists entirely.
    Useful when the user no longer wants the book in any category.
    ======================================================== */
    removeFromList(
      state,
      action: PayloadAction<{ userId: string; bookId: string }>
    ) {
      // Keep all items except the one that matches the user and book
      const res = state.filter(
        (e) =>
          !(
            e.userId === action.payload.userId &&
            e.bookId === action.payload.bookId
          )
      );

      // Save the updated list
      localStorage.setItem("mvp_reading_lists", JSON.stringify(res));

      // Return the new list to replace the old state
      return res;
    },
  },
});

/* ==========================================================
SECTION 4: Export Actions and Reducer
========================================================== */

// These exports allow other parts of the app to add or remove books from lists.
export const { addToList, removeFromList } = readingListsSlice.actions;

// The reducer is the main data manager that the app uses to track reading lists.
export default readingListsSlice.reducer;
