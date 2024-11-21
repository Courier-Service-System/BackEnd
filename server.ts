import app from "./app";
import dotenv from "dotenv";
import "./config/database";

dotenv.config({ path: __dirname + "/config/.env" });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
