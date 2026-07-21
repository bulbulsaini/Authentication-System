import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Extend Express Request so we can attach the user's id to it
export interface AuthRequest extends Request {
  userId?: string;
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction): void => {
  // Token comes in the header like: Authorization: Bearer <token>
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token, access denied" });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as { id: string };
    req.userId = decoded.id; // attach user id to the request
    next();
  } catch {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
};
