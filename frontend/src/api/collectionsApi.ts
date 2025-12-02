import apiClient from "./axiosInstance";
const COLLECTIONS_PATH = "/collections";

export const fetchCollections = async (userId: string) => {
  const res = await apiClient.get(`${COLLECTIONS_PATH}/${userId}`);
  return res.data;
};

export const createCollection = async (userId: string, name: string) => {
  const res = await apiClient.post(COLLECTIONS_PATH, { userId, name });
  return res.data;
};

export const addBookToCollection = async (
  collectionId: string,
  bookId: string
) => {
  const res = await apiClient.post(`${COLLECTIONS_PATH}/addBook`, {
    collectionId,
    bookId,
  });
  return res.data;
};

export const removeBookFromCollection = async (
  collectionId: string,
  bookId: string
) => {
  const res = await apiClient.delete(`${COLLECTIONS_PATH}/removeBook`, {
    data: { collectionId, bookId },
  });
  return res.data;
};
