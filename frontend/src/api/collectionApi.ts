import axios from "axios";
const API = "http://localhost:5000/api/collections";

export const fetchCollections = async (userId: string) => {
  const res = await axios.get(`${API}/${userId}`);
  return res.data;
};

export const createCollection = async (userId: string, name: string) => {
  const res = await axios.post(API, { userId, name });
  return res.data;
};

export const addBookToCollection = async (
  collectionId: string,
  bookId: string
) => {
  const res = await axios.post(`${API}/addBook`, { collectionId, bookId });
  return res.data;
};

export const removeBookFromCollection = async (
  collectionId: string,
  bookId: string
) => {
  const res = await axios.delete(`${API}/removeBook`, {
    data: { collectionId, bookId },
  });
  return res.data;
};
