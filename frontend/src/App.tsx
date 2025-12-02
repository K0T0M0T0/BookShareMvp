/* =========================
File: src/App.tsx
========================= */
import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import Layout from "./components/common/Layout/Layout";
import AppRoutes from "./app/routes";
import { loadBooks } from "./store/Slices/booksSlice";
import { loadUsers } from "./store/Slices/usersSlice";
import { loadReadingLists } from "./store/Slices/readingListsSlice";
import { useAppDispatch, useAppSelector } from "./app/hooks";

// Main app with routes. Layout contains navbar and theme control.
export default function App() {
  const dispatch = useAppDispatch();
  const session = useAppSelector((s) => s.session);

  useEffect(() => {
    dispatch(loadBooks());
  }, [dispatch]);

  useEffect(() => {
    if (session.token) {
      dispatch(loadUsers());
    }
  }, [dispatch, session.token]);

  useEffect(() => {
    if (session.userId) {
      dispatch(loadReadingLists(session.userId));
    }
  }, [dispatch, session.userId]);

  return (
    <BrowserRouter>
      <Layout>
        <AppRoutes />
      </Layout>
    </BrowserRouter>
  );
}
