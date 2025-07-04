import express from "express";
import {
  createMotion,
  deleteMotion,
  getAllMotion,
  getMotionByMotion,
  updateMotion,
} from "../../controllers/motion/motion.controller.js";
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

const router = express.Router();

router.get("/", authenticate, authorizeRole(['admin']), getAllMotion);
router.get("/:id", authenticate, authorizeRole(['admin']), getMotionByMotion);
router.post("/create", authenticate, authorizeRole(['admin']), createMotion); 
router.put("/update/:id", authenticate, authorizeRole(['admin']), updateMotion);
router.delete("/delete/:id", authenticate, authorizeRole(['admin']), deleteMotion);

export default router;
