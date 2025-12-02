import apiClient from "./axiosInstance";

const USERS_PATH = "/users";

function convertMongoId(obj: any): any {
  if (!obj) return obj;
  if (Array.isArray(obj)) return obj.map(convertMongoId);
  if (obj._id) {
    const { _id, ...rest } = obj;
    return { id: _id.toString(), ...convertMongoId(rest) };
  }
  if (typeof obj === "object") {
    const clone: any = {};
    for (const key in obj) clone[key] = convertMongoId(obj[key]);
    return clone;
  }
  return obj;
}

export async function loginUser(email: string, password: string) {
  const res = await apiClient.post(`${USERS_PATH}/login`, { email, password });
  return convertMongoId(res.data);
}

export async function registerUser(user: {
  username: string;
  email: string;
  password: string;
}) {
  const res = await apiClient.post(`${USERS_PATH}/register`, user);
  return convertMongoId(res.data);
}

