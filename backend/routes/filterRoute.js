import express from "express";

import { getFilters } from "../controllers/filters/filterReciept.js";

const router = express.Router();

router.post("/get-filter", getFilters);

export default router;
