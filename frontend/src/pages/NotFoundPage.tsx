/* ==========================================================
File: src/pages/NotFoundPage.tsx
Purpose: Simple 404 screen for unmatched routes.
========================================================== */
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="not-found">
      <h1>Page not found</h1>
      <p>The page you are looking for may have been moved or deleted.</p>
      <Link to="/">Return home</Link>
    </section>
  );
}

