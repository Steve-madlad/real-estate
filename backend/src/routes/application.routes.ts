import { Router } from "express";
import {
  createApplication,
  getApplicationsByProperty,
  listApplications,
  processAplication,
} from "../controllers/application.controller.js";
import { authMiddleWare } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleWare(["tenant", "manager"]), listApplications);
router.get(
  "/property/:propertyId",
  authMiddleWare(["tenant", "manager"]),
  getApplicationsByProperty,
);
router.post("/", authMiddleWare(["tenant"]), createApplication);
router.put("/:id/process", authMiddleWare(["manager"]), processAplication);

export default router;
