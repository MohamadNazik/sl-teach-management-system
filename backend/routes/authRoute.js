import express from "express";
import { changeStaffIdController } from "../controllers/auth/changeStaffId.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { changeUsernameController } from "../controllers/auth/changeUsername.js";

const router = express.Router();

router.post("/change-staffid", requireSignIn, changeStaffIdController);
router.post("/change-username", requireSignIn, changeUsernameController);

export default router;
