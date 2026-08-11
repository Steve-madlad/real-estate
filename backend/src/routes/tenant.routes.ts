import express from "express";
import {
  createTenant,
  getCurrentresidences,
  getTenant,
  updateTenant,
} from "../controllers/tenant.controller.js";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.get("/:cognitoId/current-residences", getCurrentresidences);
router.put("/:cognitoId", updateTenant);
router.post("/", createTenant);

export default router;
