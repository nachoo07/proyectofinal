import express from "express";

const router = express.Router();
import {
  createNotification,
  deleteNotification,
  getAllNotification,
  getNotificicationByNotification,
  updateNotification,
} from "../../controllers/notification/notification.controller.js";
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

router.get("/notifications/", authenticate, authorizeRole(['admin']), getAllNotification);
router.get("/notifications/:id", authenticate, authorizeRole(['admin']), getNotificicationByNotification);
router.post("/notifications", authenticate, authorizeRole(['admin']), createNotification); // Ruta corregida
router.put("/notifications/:id", authenticate, authorizeRole(['admin']), updateNotification);
router.delete("/notifications/:id", authenticate, authorizeRole(['admin']), deleteNotification);

export default router;
