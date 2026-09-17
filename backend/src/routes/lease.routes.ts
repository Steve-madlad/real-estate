import express from "express";
import {
  getLeasePayments,
  getPropertyLeases,
} from "../controllers/lease.controller.js";

const router = express.Router();

router.get("/property/:id", getPropertyLeases);
router.get("/:id/payments", getLeasePayments);

export default router;
