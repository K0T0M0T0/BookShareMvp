/* =========================
File: src/App.tsx
========================= */
import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MainNavbar } from "./layout/MainNavbar";
import Home from "./pages/Home/Home";
import AdminZoneNav from "./features/admin/components/AdminNavbar";
import UsersPage from "./features/admin/pages/Users/UsersPages";
import LogsPage from "./features/admin/pages/Logs/LogsPage";
import RequestsPage from "./features/admin/pages/Requests/RequestsPage";
import { adminAuthService } from "./features/admin/services/adminAuthService";
import CreateBookForm from "./pages/CreateBook/CreateBookForm";
import BookPage from "./pages/BookPage/BookPage";
import ChapterPage from "./pages/BookPage/ChapterPage/ChapterPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/profilePage";
import CollectionsPage from "./pages/collections/collections";
import SearchPage from "./pages/search/SearchPage";
import { loadBooks } from "./store/Slices/booksSlice";
import { loadUsers } from "./store/Slices/usersSlice";
import { loadReadingLists } from "./store/Slices/readingListsSlice";
import type { AppDispatch, RootState } from "./store/store";

// Main app with routes. AppShell contains navbar and theme control.
export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const session = useSelector((s: RootState) => s.session);
  const isAdmin = adminAuthService.isAdmin();

  // Load initial data from backend
  useEffect(() => {
    dispatch(loadBooks());
    dispatch(loadUsers());
    if (session.userId) {
      dispatch(loadReadingLists(session.userId));
    }
  }, [dispatch, session.userId]);
  return (
    <BrowserRouter>
      <MainNavbar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books/create" element={<CreateBookForm />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/books/:id/ch/:cid" element={<ChapterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/collections" element={<CollectionsPage />} />
          <Route path="/collections/:id" element={<CollectionsPage />} />
          <Route path="/search" element={<SearchPage />} />
          {isAdmin && (
            <Route
              path="/admin"
              element={
                <div>
                  <AdminZoneNav />
                </div>
              }
            >
              <Route path="users" element={<UsersPage />} />
              <Route path="logs" element={<LogsPage />} />
              <Route path="requests" element={<RequestsPage />} />
            </Route>
          )}
        </Routes>
      </MainNavbar>
    </BrowserRouter>
  );
}
