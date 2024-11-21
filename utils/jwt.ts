import { Response } from "express";
import { User } from "../models/userModel"; // Adjust import path as needed
import jwt from "jsonwebtoken";

interface TokenOptions {
  expires: Date;
  httpOnly: boolean;
}

export const sendToken = (user: User, statusCode: number, res: Response) => {
  // Create JWT token
  const token = generateToken(user);

  // Setting the cookie options
  const options: TokenOptions = {
    expires: new Date(
      Date.now() +
        (Number(process.env.COOKIE_EXPIRES_TIME) || 1) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

// Helper function to generate token
function generateToken(user: User): string {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_TIME || "1d",
  });
}
