import express from "express";
import { addFieldsController } from "../controllers/reciepts/addField.js";
import { deleteFieldController } from "../controllers/reciepts/deleteField.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import { getAllFieldController } from "../controllers/reciepts/getFileds.js";
import formidable from "express-formidable";
import { createRecieptController } from "../controllers/reciepts/createReciept.js";
import {
  getRecieptsController,
  getSingleRecieptController,
} from "../controllers/reciepts/getReciepts.js";
import { deleteRecieptController } from "../controllers/reciepts/deleteReciept.js";
import { updateRecieptController } from "../controllers/reciepts/updateReciept.js";
import {
  addFavouriteController,
  getFavouritesController,
  removeFavouriteController,
} from "../controllers/reciepts/favourite.js";

const router = express.Router();

router.post("/add-field", addFieldsController);
router.post("/delete-field", deleteFieldController);
router.get("/get-fields", getAllFieldController);
router.post("/create-receipt", formidable(), createRecieptController);
router.get("/get-receipts", getRecieptsController);
router.get("/get-single-reciept/:id", getSingleRecieptController);
router.delete("/delete-receipt/:id", deleteRecieptController);
router.post("/update-receipt/:id", formidable(), updateRecieptController);
router.post("/add-favourite", addFavouriteController);
router.post("/remove-favourite", removeFavouriteController);
router.get("/get-favourite/:userId", getFavouritesController);
export default router;
