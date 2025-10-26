import { request } from "./apiBase";

export const BooksAPI = {
  getAll: () => request("/books"),
  add: (data: any) =>
    request("/books", { method: "POST", body: JSON.stringify(data) }),
  update: (id: string, data: any) =>
    request(`/books/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (id: string) => request(`/books/${id}`, { method: "DELETE" }),
};
