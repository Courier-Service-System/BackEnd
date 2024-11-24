import { Request, Response, NextFunction } from "express";
import pool from "../config/database";
import { catchAsyncError } from "../middlewares/catchAsyncError";
import { ErrorHandler } from "../utils/errorHandler";

export const createShipping = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("Create shipping request:", {
        user: req.user,
        body: req.body,
      });

      if (!req.user?.id) {
        return next(new ErrorHandler("Authentication required", 401));
      }

      const {
        first_name,
        last_name,
        address,
        city,
        postal_code,
        description,
        weight,
      } = req.body;

      // Validate each field individually
      if (!first_name)
        return next(new ErrorHandler("First name is required", 400));
      if (!last_name)
        return next(new ErrorHandler("Last name is required", 400));
      if (!address) return next(new ErrorHandler("Address is required", 400));
      if (!city) return next(new ErrorHandler("City is required", 400));
      if (!postal_code)
        return next(new ErrorHandler("Postal code is required", 400));
      if (!description)
        return next(new ErrorHandler("Description is required", 400));
      if (!weight) return next(new ErrorHandler("Weight is required", 400));

      // Validate weight
      const weightNum = Number(weight);
      if (isNaN(weightNum) || weightNum <= 0) {
        return next(new ErrorHandler("Weight must be a positive number", 400));
      }

      const query = `
        INSERT INTO shipping_orders 
        (user_id, first_name, last_name, address, city, postal_code, description, weight)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        req.user.id,
        first_name,
        last_name,
        address,
        city,
        postal_code,
        description,
        weightNum,
      ];

      console.log("Executing query with values:", values);

      const result = await pool.query(query, values);

      res.status(201).json({
        success: true,
        message: "Shipping order created successfully",
        shipping: result.rows[0],
      });
    } catch (error) {
      console.error("Database error:", error);
      return next(
        new ErrorHandler(
          error instanceof Error
            ? error.message
            : "Failed to create shipping order",
          500
        )
      );
    }
  }
);

// Get User's Shipping Orders
export const getUserShippings = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    try {
      const query = `
        SELECT * FROM shipping_orders 
        WHERE user_id = $1 
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query, [req.user.id]);

      res.status(200).json({
        success: true,
        count: result.rows.length,
        shippings: result.rows,
      });
    } catch (error) {
      console.error("Fetching shipping orders error:", error);
      return next(new ErrorHandler("Failed to fetch shipping orders", 500));
    }
  }
);

// Get Single Shipping Order
export const getShippingById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ErrorHandler("Authentication required", 401));
    }

    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Shipping order ID is required", 400));
    }

    try {
      const query = `
        SELECT * FROM shipping_orders 
        WHERE id = $1 AND user_id = $2
      `;

      const result = await pool.query(query, [id, req.user.id]);

      if (result.rows.length === 0) {
        return next(new ErrorHandler("Shipping order not found", 404));
      }

      res.status(200).json({
        success: true,
        shipping: result.rows[0],
      });
    } catch (error) {
      console.error("Fetching shipping order error:", error);
      return next(new ErrorHandler("Failed to fetch shipping order", 500));
    }
  }
);

// Get All Orders for Admin
export const getAllOrders = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = `
        SELECT * FROM shipping_orders 
        ORDER BY created_at DESC
      `;

      const result = await pool.query(query);

      res.status(200).json({
        success: true,
        count: result.rows.length,
        orders: result.rows,
      });
    } catch (error) {
      console.error("Fetching all orders error:", error);
      return next(new ErrorHandler("Failed to fetch orders", 500));
    }
  }
);

// Search Orders by ID
export const searchOrderById = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    if (!id) {
      return next(new ErrorHandler("Order ID is required", 400));
    }

    try {
      const query = `
        SELECT * FROM shipping_orders 
        WHERE id = $1
      `;

      const result = await pool.query(query, [id]);

      if (result.rows.length === 0) {
        return next(new ErrorHandler("Order not found", 404));
      }

      res.status(200).json({
        success: true,
        order: result.rows[0],
      });
    } catch (error) {
      console.error("Search order by ID error:", error);
      return next(new ErrorHandler("Failed to search order", 500));
    }
  }
);
