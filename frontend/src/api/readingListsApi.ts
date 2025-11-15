const API_URL = "http://localhost:5000/api/reading-lists";

/* Helper function to convert MongoDB _id to id */
function convertMongoId(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) {
    return obj.map(convertMongoId);
  }
  if (typeof obj === "object" && obj._id) {
    const { _id, ...rest } = obj;
    return { id: _id.toString(), ...convertMongoId(rest) };
  }
  if (typeof obj === "object") {
    const converted: any = {};
    for (const key in obj) {
      converted[key] = convertMongoId(obj[key]);
    }
    return converted;
  }
  return obj;
}

/* Fetch reading lists for a user */
export async function fetchUserReadingLists(userId: string) {
  const res = await fetch(`${API_URL}/${userId}`);
  if (!res.ok) throw new Error("Failed to fetch reading lists");
  const data = await res.json();
  return convertMongoId(data);
}

/* Add or move a book to a list */
export async function addBookToList(data: {
  userId: string;
  bookId: string;
  list: string;
}) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add to list");
  const data_res = await res.json();
  return convertMongoId(data_res);
}

/* Remove a book from list */
export async function removeBookFromList(userId: string, bookId: string) {
  const res = await fetch(`${API_URL}/${userId}/${bookId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to remove from list");
  return res.json();
}

