import type { RootState } from "../../../store/store";

export const adminAuthService = {
  login: (email: string, password: string, state: RootState) => {
    const user = state.users.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) return { success: false, message: "User not found" };
    if (user.banned)
      return { success: false, message: "This account is banned." };
    if (!user.isAdmin)
      return { success: false, message: "Not authorized as admin" };

    localStorage.setItem("isAdmin", "true");
    localStorage.setItem("adminId", user.id);
    return { success: true, user };
  },

  logout: () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("adminId");
  },

  isAdmin: () => localStorage.getItem("isAdmin") === "true",
};
