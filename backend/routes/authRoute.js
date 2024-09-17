import express from "express";
import { changeStaffIdController } from "../controllers/auth/changeStaffId.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { changeUsernameController } from "../controllers/auth/changeUsername.js";
import { changePassword } from "../controllers/auth/changePassword.js";

const router = express.Router();

router.post("/change-staffid", requireSignIn, changeStaffIdController);
router.post("/change-username", requireSignIn, changeUsernameController);
router.put("/change-password/:id", requireSignIn, changePassword);

export default router;
