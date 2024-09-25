import express from "express";

import { getFilters } from "../controllers/filters/filterReciept.js";
import { updateColorController } from "../controllers/filters/colorsOfRaw.js";

const router = express.Router();

router.post("/get-filter", getFilters);
router.put("/update-color/:id", updateColorController);

export default router;
