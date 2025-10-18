/* =========================
File: src/App.tsx
========================= */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainNavbar } from "./layout/MainNavbar";
import Home from "./pages/Home/Home";

import CreateBookForm from "./pages/CreateBook/CreateBookForm";
import BookPage from "./pages/BookPage/BookPage";
import ChapterPage from "./pages/BookPage/ChapterPage/ChapterPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/profilePage";
import CollectionsPage from "./pages/collections/collections";

import SearchPage from "./pages/search/SearchPage";

// Main app with routes. AppShell contains navbar and theme control.
export default function App() {
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
        </Routes>
      </MainNavbar>
    </BrowserRouter>
  );
}
