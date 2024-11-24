import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/database";
import { users } from "../models/userModel";
import { ErrorHandler } from "../utils/errorHandler";
import { catchAsyncError } from "./catchAsyncError";

declare global {
  namespace Express {
    interface Request {
      user?: users;
    }
  }
}

export const isAuthenticatedUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      return next(
        new ErrorHandler("Please login to access this resource", 401)
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "") as {
      id: number;
    };

    const user = await findUserById(decoded.id);

    if (!user) {
      return next(new ErrorHandler("User not found", 401));
    }

    req.user = user;
    next();
  }
);

async function findUserById(id: number): Promise<users | null> {
  try {
    const result = await pool.query<users>(
      "SELECT * FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  } catch (err) {
    if (err instanceof Error) {
      console.error("Error finding user by ID:", err.message);
    } else {
      console.error("Unknown error occurred while finding user by ID");
    }
    throw new Error("Database query failed");
  }
}

export { catchAsyncError };
