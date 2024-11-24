import { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "../utils/errorHandler";

export const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user?.role || "";
    if (!roles.includes(userRole)) {
      return next(new ErrorHandler("Access denied", 403));
    }
    next();
  };
};
