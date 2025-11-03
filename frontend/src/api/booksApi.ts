const API_URL = "http://localhost:5000/api/books";

export async function fetchAllBooks() {
  const res = await fetch(API_URL);
  return res.json();
}

export async function createBook(book: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(book),
  });
  return res.json();
}

export async function updateBook(id: string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteBook(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  const result = await res.json();
  return result.id;
}
