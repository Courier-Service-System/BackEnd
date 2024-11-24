import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import shippingCreation from "./routes/shippingCreationRoutes";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRoutes);
app.use("/api/v1", shippingCreation);

export default app;
