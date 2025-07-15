import express from "express";
import {
  createMotion,
  deleteMotion,
  getAllMotion,
  getAllMotionPaginated,
  getMotionByMotion,
  updateMotion,
  getMotionsByMonth,
  getMotionsByWeek,
  getMotionsByQuarter,
  getMotionsByPaymentMethod
} from "../../controllers/motion/motion.controller.js";
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

const router = express.Router();

router.get("/", authenticate, authorizeRole(['admin']), getAllMotion);
router.get("/paginated", authenticate, authorizeRole(['admin']), getAllMotionPaginated);
router.get("/:id", authenticate, authorizeRole(['admin']), getMotionByMotion);
router.post("/create", authenticate, authorizeRole(['admin']), createMotion); 
router.put("/update/:id", authenticate, authorizeRole(['admin']), updateMotion);
router.delete("/delete/:id", authenticate, authorizeRole(['admin']), deleteMotion);
router.get('/by-quarter', authenticate, authorizeRole(['admin']), getMotionsByQuarter);
router.get('/by-month', authenticate, authorizeRole(['admin']), getMotionsByMonth);
router.get('/by-week', authenticate, authorizeRole(['admin']), getMotionsByWeek);
router.get('/by-payment-method', authenticate, authorizeRole(['admin']), getMotionsByPaymentMethod);
export default router;
