import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../config/.env" });

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

pool
  .connect()
  .then(() => console.log("Connected to the PostgreSQL database"))
  .catch((err: Error) =>
    console.error("Failed to connect to the database", err.message)
  );

export default pool;
