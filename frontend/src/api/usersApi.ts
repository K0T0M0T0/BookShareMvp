import apiClient from "./axiosInstance";

const USERS_PATH = "/users";

/* Helper: normalize MongoDB _id → id */
function convertMongoId(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(convertMongoId);
  if (obj._id) {
    const { _id, ...rest } = obj;
    return { id: _id.toString(), ...convertMongoId(rest) };
  }
  if (typeof obj === "object") {
    const newObj: any = {};
    for (const key in obj) newObj[key] = convertMongoId(obj[key]);
    return newObj;
  }
  return obj;
}

/* Fetch all users (ADMIN ONLY) */
export async function fetchAllUsers(token: string) {
  const res = await apiClient.get(USERS_PATH, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return convertMongoId(res.data);
}

/* Update user (admin only or self-edit) */
export async function updateUser(id: string, data: any, token: string) {
  const res = await apiClient.put(`${USERS_PATH}/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return convertMongoId(res.data);
}

/* Delete user (admin only) */
export async function deleteUser(id: string, token: string) {
  const res = await apiClient.delete(`${USERS_PATH}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}
