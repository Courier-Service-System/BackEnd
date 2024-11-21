import { Request, Response, NextFunction } from "express";
import pool from "../config/database";
import { User } from "../models/userModel";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../utils/errorHandler";
import { sendToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const {
      first_name,
      last_name,
      email,
      password,
      address,
      telephone_number,
    } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: Omit<User, "id" | "created_at"> = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      address,
      telephone_number,
    };

    const user = await createUser(newUser);

    sendToken(user, 201, res);
  }
);

export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email & password", 400));
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return next(new ErrorHandler("Invalid Email or Password", 401));
    }

    sendToken(user, 200, res);
  }
);

async function createUser(
  user: Omit<User, "id" | "created_at">
): Promise<User> {
  const { first_name, last_name, email, password, address, telephone_number } =
    user;

  const result = await pool.query<User>(
    `INSERT INTO users (first_name, last_name, email, password, address, telephone_number)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [first_name, last_name, email, password, address, telephone_number]
  );

  return result.rows[0];
}

async function findUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query<User>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows.length > 0 ? result.rows[0] : null;
}

function generateToken(user: User): string {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "default_secret", {
    expiresIn: process.env.JWT_EXPIRES_TIME || "1h",
  });
}
