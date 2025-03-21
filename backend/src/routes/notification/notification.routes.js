import express from "express";

const notificationRouter = express.Router();
import controller from "../../controllers/notification/notification.controller.js";

notificationRouter.get("/notifications/", controller.allNotifications);
notificationRouter.get("/notifications/:id", controller.singleNotification);
notificationRouter.post("/notifications", controller.createNotification); // Ruta corregida
notificationRouter.put("/notifications/:id", controller.updateNotification);
notificationRouter.delete("/notifications/:id", controller.deleteNotification);

export default notificationRouter;