import express from "express";

const router = express.Router();
import controller from "../../controllers/notification/notification.controller.js";

router.get("/notifications/", getAllNotification);
router.get("/notifications/:id", getNotificicationByNotification);
router.post("/notifications",createNotification ); // Ruta corregida
router.put("/notifications/:id",updateNotification);
router.delete("/notifications/:id", deleteNotification);

export default notificationRouter;