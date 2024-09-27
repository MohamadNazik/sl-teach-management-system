import express from "express";
import { updateColorController } from "../controllers/filters/colorsOfRaw.js";

import { getFilters } from "../controllers/filters/filterReciept.js";

const router = express.Router();

router.post("/get-filter", getFilters);
router.put("/update-color/:id", updateColorController);

export default router;
