import express from "express";
import morgan from "morgan";
import ConnectDB from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";
import receiptRoute from "./routes/recieptRoute.js";
import filterRoute from "./routes/filterRoute.js";

// Load environment variables
dotenv.config();

const app = express();
ConnectDB();

// Middleware setup
app.use(
  cors({
    origin: process.env.FRONTEND_URI || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoute);
app.use("/api/receipt", receiptRoute);
app.use("/api/filter", filterRoute);

// Port configuration
const PORT = process.env.PORT || 8000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
