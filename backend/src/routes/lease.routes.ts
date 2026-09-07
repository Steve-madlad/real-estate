import express from "express";
import {
  getLeasePayments,
  getLeases,
} from "../controllers/lease.controller.js";

const router = express.Router();

router.get("/", getLeases);
router.get("/:id/payments", getLeasePayments);

export default router;
