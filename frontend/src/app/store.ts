/* =========================
File: src/app/store.ts
========================= */
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../store/Slices/usersSlice";
import sessionReducer from "../store/Slices/sessionSlice";
import booksReducer from "../store/Slices/booksSlice";
import readingListsReducer from "../store/Slices/readingListsSlice";
import logsReducer from "../store/Slices/logsSlice";
import collectionsReducer from "../store/Slices/collectionsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    session: sessionReducer,
    books: booksReducer,
    readingLists: readingListsReducer,
    logs: logsReducer,
    collections: collectionsReducer, // ✅ add
  },
});
// ✅ Allow slices to dispatch logs safely
(window as any).store = store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
