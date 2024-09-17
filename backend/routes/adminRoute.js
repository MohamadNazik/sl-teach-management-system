import express from "express";

import { adminLoginController } from "../controllers/Admin/adminController.js";
import { getAllStaff } from "../controllers/Admin/getAllStaff.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { deleteStaffController } from "../controllers/Admin/deleteStaff.js";
import { createStaffUserController } from "../controllers/Admin/createStaffUser.js";

const router = express.Router();

router.post("/admin-login", adminLoginController);
router.get("/get-all-staff", requireSignIn, getAllStaff);
router.delete("/delete-staff-user/:id", requireSignIn, deleteStaffController);
router.post("/create-staff-user", requireSignIn, createStaffUserController);

export default router;
