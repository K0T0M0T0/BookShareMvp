/* =========================
File: src/store/store.ts
========================= */
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./usersSlice";
import sessionReducer from "./sessionSlice";
import booksReducer from "./booksSlice";

// Central Redux store
export const store = configureStore({
  reducer: {
    users: usersReducer,
    session: sessionReducer,
    books: booksReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
