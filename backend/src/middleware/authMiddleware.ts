import jwt from "jsonwebtoken";
import User from "../models/user";
import { Request, Response, NextFunction } from "express";

export const protect = async (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  let token;

  // 1️⃣ Extract token from Authorization header
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    // 2️⃣ Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;

    // 3️⃣ Fetch user from database
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // 4️⃣ Store user in req
    req.user = user;

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const adminOnly = (
  req: Request & { user?: any },
  res: Response,
  next: NextFunction
) => {
  // 1️⃣ protect() must run first → it sets req.user
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  // 2️⃣ Check admin role
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Admins only" });
  }

  next();
};
