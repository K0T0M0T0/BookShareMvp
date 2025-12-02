import apiClient from "./axiosInstance";

const READING_LISTS_PATH = "/reading-lists";

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
  const res = await apiClient.get(`${READING_LISTS_PATH}/${userId}`);
  return convertMongoId(res.data);
}

/* Add or move a book to a list */
export async function addBookToList(data: {
  userId: string;
  bookId: string;
  list: string;
}) {
  const res = await apiClient.post(READING_LISTS_PATH, data);
  return convertMongoId(res.data);
}

/* Remove a book from list */
export async function removeBookFromList(userId: string, bookId: string) {
  const res = await apiClient.delete(`${READING_LISTS_PATH}/${userId}/${bookId}`);
  return res.data;
}

