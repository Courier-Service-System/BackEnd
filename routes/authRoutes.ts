import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController";
import { checkRole } from "../middlewares/checkRole";
import { isAuthenticatedUser } from "../middlewares/authMiddleware";

const router = express.Router();

router.route("/register-admin").post(registerUser);
router.route("/register-user").post(registerUser);
router.route("/login").post(loginUser);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);

router
  .route("/register")
  .post(isAuthenticatedUser, checkRole(["admin"]), registerUser);

export default router;
