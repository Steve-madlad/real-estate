import express from "express";
import {
  createTenant,
  favoriteProperty,
  getCurrentresidences,
  getTenant,
  unfavoriteProperty,
  updateTenant,
} from "../controllers/tenant.controller.js";

const router = express.Router();

router.get("/:cognitoId", getTenant);
router.get("/:cognitoId/current-residences", getCurrentresidences);
router.put("/:cognitoId", updateTenant);
router.post("/:cognitoId/favorite/:propertyId", favoriteProperty);
router.delete("/:cognitoId/favorite/:propertyId", unfavoriteProperty);
router.post("/", createTenant);

export default router;
