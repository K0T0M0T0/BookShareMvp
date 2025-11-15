const API_URL = "http://localhost:5000/api/users";

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

/* Fetch all users */
export async function fetchAllUsers() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Failed to fetch users");
  const data = await res.json();
  return convertMongoId(data);
}

/* Register a new user */
export async function registerUser(user: any) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to register user");
  }
  const data = await res.json();
  return convertMongoId(data);
}

/* Update a user */
export async function updateUser(id: string, data: any) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  const data_res = await res.json();
  return convertMongoId(data_res);
}

/* Delete a user */
export async function deleteUser(id: string) {
  const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
}

/* Login user (check credentials) */
export async function loginUser(email: string, password: string) {
  const users = await fetchAllUsers();
  const user = users.find(
    (u: any) => u.email === email && u.password === password
  );
  if (!user) throw new Error("Invalid credentials");
  return user;
}
