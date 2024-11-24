import { Request, Response, NextFunction } from "express";
import pool from "../config/database";
import { users } from "../models/userModel";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../utils/errorHandler";
import { sendToken } from "../utils/jwt";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { userValidationSchema } from "../middlewares/validationSchema";
import { ValidationError } from "yup";
import nodemailer from "nodemailer";

// Register User
export const registerUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        first_name,
        last_name,
        email,
        password,
        address,
        telephone_number,
        role,
        nic,
      } = req.body;

      console.log("Registration attempt for:", {
        email,
        role,
        first_name,
        last_name,
      });

      try {
        await userValidationSchema.validate(req.body, { abortEarly: false });
      } catch (error) {
        if (error instanceof ValidationError) {
          return res.status(400).json({
            success: false,
            message: error.errors.join(", "),
          });
        }
        throw error;
      }

      const existingUser = await findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User with this email already exists",
        });
      }

      if (role === "admin") {
        const existingAdmins = await findUsersByRole("admin");
        if (existingAdmins.length > 0) {
          const isAuthorizedAdmin = req.user && req.user.role === "admin";
          if (!isAuthorizedAdmin) {
            return res.status(403).json({
              success: false,
              message: "Only existing admins can create new admin accounts",
            });
          }
        }
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await createUser({
        first_name,
        last_name,
        email,
        password: hashedPassword,
        address,
        telephone_number,
        role: role || "user",
        nic,
      });

      sendToken(newUser, 201, res);
    } catch (error) {
      console.error("Registration error:", error);
      return next(new ErrorHandler("Registration failed", 500));
    }
  }
);

// Login User
export const loginUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: "Please provide email and password",
        });
      }

      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "Invalid email or password",
        });
      }

      sendToken(user, 200, res);
    } catch (error) {
      console.error("Login error:", error);
      return next(new ErrorHandler("Login failed", 500));
    }
  }
);

// Forgot Password
export const forgotPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;

      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const resetToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || "default_secret",
        { expiresIn: "1h" }
      );

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Password Reset Request",
        html: `
          <h1>Password Reset Request</h1>
          <p>Please click on the following link to reset your password:</p>
          <a href="${resetUrl}">${resetUrl}</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({
        success: true,
        message: "Password reset email sent successfully",
      });
    } catch (error) {
      console.error("Forgot password error:", error);
      return next(new ErrorHandler("Failed to send reset email", 500));
    }
  }
);

// Reset Password
export const resetPassword = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.params;
      const { password } = req.body;

      let decoded: JwtPayload;
      try {
        decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "default_secret"
        ) as JwtPayload;
      } catch (error) {
        return res.status(400).json({
          success: false,
          message: "Invalid or expired reset token",
        });
      }

      const user = await findUserById(decoded.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await updateUserPassword(user.id, hashedPassword);

      res.status(200).json({
        success: true,
        message: "Password reset successful",
      });
    } catch (error) {
      console.error("Reset password error:", error);
      return next(new ErrorHandler("Failed to reset password", 500));
    }
  }
);

// Database helper functions
async function createUser(
  userData: Omit<users, "id" | "created_at">
): Promise<users> {
  const {
    first_name,
    last_name,
    email,
    password,
    address,
    telephone_number,
    role,
    nic,
  } = userData;

  const result = await pool.query<users>(
    `INSERT INTO users 
    (first_name, last_name, email, password, address, telephone_number, role, nic)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *`,
    [
      first_name,
      last_name,
      email,
      password,
      address,
      telephone_number,
      role,
      nic,
    ]
  );

  return result.rows[0];
}

async function findUserByEmail(email: string): Promise<users | null> {
  const result = await pool.query<users>(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
  return result.rows[0] || null;
}

async function findUserById(id: number): Promise<users | null> {
  const result = await pool.query<users>("SELECT * FROM users WHERE id = $1", [
    id,
  ]);
  return result.rows[0] || null;
}

async function findUsersByRole(role: string): Promise<users[]> {
  const result = await pool.query<users>(
    "SELECT * FROM users WHERE role = $1",
    [role]
  );
  return result.rows;
}

async function updateUserPassword(
  userId: number,
  newPassword: string
): Promise<void> {
  await pool.query("UPDATE users SET password = $1 WHERE id = $2", [
    newPassword,
    userId,
  ]);
}

// Export database helper functions if needed elsewhere
export {
  createUser,
  findUserByEmail,
  findUserById,
  findUsersByRole,
  updateUserPassword,
};
