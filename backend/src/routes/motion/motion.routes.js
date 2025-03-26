import express from "express";

const router = express.Router();
import controller from "../../controllers/motion/motion.controller.js";

router.get("/", getAllMotion);
router.get("/:id", getMotionByMotion);
router.post("/create", createMotion); // Ruta corregida
router.put("/update/:id", updateMotion);
router.delete("/delete/:id", deleteMotion);

export default notificationRouter;