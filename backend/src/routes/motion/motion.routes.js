import express from "express";

const router = express.Router();
import controller from "../../controllers/motion/motion.controller.js";

router.get("/motions/", getAllMotion);
router.get("/motions/:id", getMotionByMotion);
router.post("/motions", controller.createMotion); // Ruta corregida
router.put("/motions/:id", controller.updateMotion);
router.delete("/motions/:id", controller.deleteMotion);

export default notificationRouter;