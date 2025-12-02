import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ProfilePage from "../features/profile/pages/ProfilePage";
import CollectionsPage from "../features/collections/pages/CollectionsPage";
import SearchPage from "../features/books/pages/SearchPage";
import CreateBookPage from "../features/books/pages/CreateBookPage";
import BookDetailsPage from "../features/books/pages/BookDetailsPage";
import ChapterPage from "../features/books/pages/ChapterPage";
import ProtectedAdminRoute from "../features/admin/components/ProtectedAdminRoute";
import AdminZoneNav from "../features/admin/components/AdminNavbar";
import UsersPage from "../features/admin/pages/UsersPage";
import LogsPage from "../features/admin/pages/LogsPage";
import RequestsPage from "../features/admin/pages/RequestsPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/books/create" element={<CreateBookPage />} />
      <Route path="/books/:id" element={<BookDetailsPage />} />
      <Route path="/books/:id/ch/:cid" element={<ChapterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/collections" element={<CollectionsPage />} />
      <Route path="/collections/:id" element={<CollectionsPage />} />
      <Route path="/search" element={<SearchPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedAdminRoute>
            <AdminZoneNav />
          </ProtectedAdminRoute>
        }
      >
        <Route path="users" element={<UsersPage />} />
        <Route path="logs" element={<LogsPage />} />
        <Route path="requests" element={<RequestsPage />} />
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

