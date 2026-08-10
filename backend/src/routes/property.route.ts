import express from "express";
import {
  createProperty,
  getProperties,
  getProperty,
  // updateProperty,
} from "../controllers/property.controller.js";
import { authMiddleWare } from "../middleware/auth.js";
import multer from "multer";

const storage = multer.memoryStorage()
const upload = multer({storage})
const router = express.Router();

router.get("/", getProperties);
router.get("/:id", getProperty);
router.post("/", authMiddleWare(["manager"]), createProperty);
// router.put("/", authMiddleWare(["manager"]), updateProperty);

export default router;
