/* =========================
File: src/store/store.ts
========================= */
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Slices/usersSlice";
import sessionReducer from "./Slices/sessionSlice";
import booksReducer from "./Slices/booksSlice";
import readingListsReducer from "./Slices/readingListsSlice";
import logsReducer from "./Slices/logsSlice";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    session: sessionReducer,
    books: booksReducer,
    readingLists: readingListsReducer,
    logs: logsReducer,
  },
});
// ✅ Allow slices to dispatch logs safely
(window as any).store = store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
