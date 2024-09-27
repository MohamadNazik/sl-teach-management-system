import express from "express";
import { changeStaffIdController } from "../controllers/auth/changeStaffId.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { changeUsernameController } from "../controllers/auth/changeUsername.js";
import { changePassword } from "../controllers/auth/changePassword.js";

const router = express.Router();

router.post("/change-staffid", changeStaffIdController);
router.post("/change-username", changeUsernameController);
router.put("/change-password/:id", changePassword);

export default router;
