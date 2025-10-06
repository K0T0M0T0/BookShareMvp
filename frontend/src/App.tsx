/* =========================
File: src/App.tsx
========================= */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import Home from "./pages/Home";
import BooksPage from "./components/books/BooksPage";
import CreateBookForm from "./components/books/CreateBookForm";
import BookPage from "./components/books/BookPage";
import ChapterPage from "./components/books/ChapterPage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProfilePage from "./pages/profile/profilePage";
import Dashboard from "./pages/dashboard";
import SearchPage from "./pages/search/SearchPage";

// Main app with routes. AppShell contains navbar and theme control.
export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/create" element={<CreateBookForm />} />
          <Route path="/books/:id" element={<BookPage />} />
          <Route path="/books/:id/ch/:cid" element={<ChapterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/updates" element={<Dashboard />} />
          <Route path="/search" element={<SearchPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
