import express from "express";

const notificationRouter = express.Router();
import controller from "../../controllers/motion/motion.controller.js";

notificationRouter.get("/motions/", controller.allMotions);
notificationRouter.get("/motions/:id", controller.singleMotion);
notificationRouter.post("/motions", controller.createMotion); // Ruta corregida
notificationRouter.put("/motions/:id", controller.updateMotion);
notificationRouter.delete("/motions/:id", controller.deleteMotion);

export default notificationRouter;