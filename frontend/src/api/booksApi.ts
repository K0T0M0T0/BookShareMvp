const API_URL = "http://localhost:5000/api/books";

/* Fetch all books */
export async function fetchAllBooks() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch books");
  return res.json();
}

/* Fetch only approved books (optional use) */
export async function fetchApprovedBooks() {
  const res = await fetch(`${API_URL}?approved=true`);
  if (!res.ok) throw new Error("Failed to fetch approved books");
  return res.json();
}

/* Create a book */
export async function createBook(book: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  if (!res.ok) throw new Error("Failed to create book");
  return res.json();
}

/* Update a book */
export async function updateBook(id: string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update book");
  return res.json();
}

/* Delete a book */
export async function deleteBook(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete book");
  return id;
}
