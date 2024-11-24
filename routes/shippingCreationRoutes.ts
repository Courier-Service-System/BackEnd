import express from "express";
import {
  createShipping,
  getUserShippings,
  getShippingById,
  getAllOrders,
  searchOrderById,
} from "../controllers/shippingCreationController";
import { isAuthenticatedUser } from "../middlewares/authMiddleware";

const router = express.Router();


router.get("/shipping/all-orders", isAuthenticatedUser, getAllOrders);
router.get("/shipping/my-orders", isAuthenticatedUser, getUserShippings);
router.get("/shipping/search/:id", isAuthenticatedUser, searchOrderById);
router.post("/shipping/create", isAuthenticatedUser, createShipping);
router.get("/shipping/:id", isAuthenticatedUser, getShippingById);

export default router;
