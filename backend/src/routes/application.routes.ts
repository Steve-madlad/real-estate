import { Router } from "express";
import {
  createApplication,
  listApplications,
  processAplication,
} from "../controllers/application.controller.js";
import { authMiddleWare } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleWare(["tenant", "manager"]), listApplications);
router.post("/", authMiddleWare(["tenant"]), createApplication);
router.put("/:id/process", authMiddleWare(["manager"]), processAplication);

export default router;
