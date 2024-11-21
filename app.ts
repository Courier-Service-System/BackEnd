import express, { Request, Response } from "express";
import pool from "./config/database";
import { User } from "./models/userModel";
import auth from "./routes/authRoutes";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Create a new user
app.use("/api/v1/", auth);

export default app;
