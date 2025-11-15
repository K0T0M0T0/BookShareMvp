const API_URL = "http://localhost:5000/api/users";

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
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return convertMongoId(await res.json());
}

/* Register new user */
export async function registerUser(user: any) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to register user");
  return convertMongoId(await res.json());
}

/* Update user (admin only or self-edit) */
export async function updateUser(id: string, data: any, token: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return convertMongoId(await res.json());
}

/* Delete user (admin only) */
export async function deleteUser(id: string, token: string) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return await res.json();
}

/* Login user — uses REAL backend login now */
export async function loginUser(email: string, password: string) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Invalid credentials");
  }

  return convertMongoId(await res.json());
}
