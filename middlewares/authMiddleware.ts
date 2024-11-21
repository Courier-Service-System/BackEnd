import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel";
import { ErrorHandler } from "../utils/errorHandler";
import { catchAsyncError } from "./catchAsyncError";

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

// Check if user is authenticated
export const isAuthenticatedUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: number;
    };

    // Find user by ID (you'll need to implement this)
    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = user;
    next();
  }
);

// Helper function to find user by ID
async function findUserById(id: number): Promise<User | null> {
  // Implement user finding logic in your database
  // This is a placeholder - replace with actual database query
  throw new Error("Not implemented");
}
