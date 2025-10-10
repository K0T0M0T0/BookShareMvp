/* =========================
File: src/store/Slices/readingListsSlice.ts
========================= */
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type BuiltInList = "completed" | "later" | "reading" | "dropped";

export interface ReadingListEntry {
  userId: string; // owner
  bookId: string;
  list: BuiltInList | string; // string allows custom lists
}

const initial: ReadingListEntry[] = JSON.parse(
  localStorage.getItem("mvp_reading_lists") || "[]"
);

const readingListsSlice = createSlice({
  name: "readingLists",
  initialState: initial,
  reducers: {
    addToList(
      state,
      action: PayloadAction<{ userId: string; bookId: string; list: BuiltInList | string }>
    ) {
      const { userId, bookId, list } = action.payload;
      const existing = state.find((e) => e.userId === userId && e.bookId === bookId);
      if (existing) {
        existing.list = list;
      } else {
        state.push({ userId, bookId, list });
      }
      localStorage.setItem("mvp_reading_lists", JSON.stringify(state));
    },
    removeFromList(state, action: PayloadAction<{ userId: string; bookId: string }>) {
      const res = state.filter((e) => !(e.userId === action.payload.userId && e.bookId === action.payload.bookId));
      localStorage.setItem("mvp_reading_lists", JSON.stringify(res));
      return res;
    },
  },
});

export const { addToList, removeFromList } = readingListsSlice.actions;
export default readingListsSlice.reducer;




