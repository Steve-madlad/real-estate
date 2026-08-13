import express from "express";
import {
  getLeasePayments,
  getLeases,
} from "../controllers/lease.controller.js";

const router = express.Router();

router.get("/", getLeases);
router.get("/payments", getLeasePayments);

export default router;
