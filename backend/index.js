import express from "express";
import morgan from "morgan";
import ConnectDB from "./config/database.js";
import dotenv from "dotenv";
import cors from "cors";
import adminRoute from "./routes/adminRoute.js";
import authRoute from "./routes/authRoute.js";
import recieptRoute from "./routes/recieptRoute.js";
import formidable from "express-formidable";

dotenv.config();
const app = express();
ConnectDB();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
// app.use(formidable({ multiples: true }));
const PORT = process.env.PORT || 8000;

app.use("/api/admin", adminRoute);
app.use("/api/auth", authRoute);
app.use("/api/receipt", recieptRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port  http://localhost:${PORT}`);
});
