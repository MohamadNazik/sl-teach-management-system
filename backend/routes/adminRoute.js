import express from "express";

import { adminLoginController } from "../controllers/Admin/adminController.js";
import { getAllStaff } from "../controllers/Admin/getAllStaff.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { deleteStaffController } from "../controllers/Admin/deleteStaff.js";
import { createStaffUserController } from "../controllers/Admin/createStaffUser.js";
import {
  forgotPAsswordController,
  resendOTPController,
  resetPasswordController,
  verifyOTPController,
  //   resetPasswordController,
} from "../controllers/Admin/forgotPassword.js";

const router = express.Router();

router.post("/admin-login", adminLoginController);
router.get("/get-all-staff", getAllStaff);
router.delete("/delete-staff/:id", deleteStaffController);
router.post("/create-staff", createStaffUserController);
router.post("/forgot-password", forgotPAsswordController);
router.post("/verifyOTP", verifyOTPController);
router.post("/resendOTP", resendOTPController);
router.post("/reset-password", resetPasswordController);
export default router;
