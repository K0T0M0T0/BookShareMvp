/* =========================
File: src/App.tsx
========================= */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Home } from "./pages/Home";
import { BooksList } from "./pages/books/BooksList";
import { BookInfo } from "./pages/books/BookInfo";
import { ChapterReader } from "./pages/books/ChapterReader";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { Dashboard } from "./pages/Dashboard";

// Main App component with routes
export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<BooksList />} />
          <Route path="/books/:id" element={<BookInfo />} />
          <Route path="/books/:id/chapter/:cid" element={<ChapterReader />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
