import express from "express";
import { addFieldsController } from "../controllers/reciepts/addField.js";
import { deleteRecieptController } from "../controllers/reciepts/deleteField.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { getAllFieldController } from "../controllers/reciepts/getFileds.js";
import formidable from "express-formidable";
import { createRecieptController } from "../controllers/reciepts/createReciept.js";
import { getRecieptsController } from "../controllers/reciepts/getReciepts.js";

const router = express.Router();

router.post("/add-field", addFieldsController);
router.post("/delete-field", deleteRecieptController);
router.get("/get-fields", getAllFieldController);
router.post("/create-reciept", formidable(), createRecieptController);
router.get("/get-reciepts", getRecieptsController);
export default router;
