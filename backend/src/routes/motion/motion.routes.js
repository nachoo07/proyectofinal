import express from "express";
import {getAllMotion,getMotionByMotion,createMotion,updateMotion ,deleteMotion} from '../../controllers/motion/motion.controller.js'
const router = express.Router();

router.get("/", getAllMotion);
router.get("/:id", getMotionByMotion);
router.post("/create", createMotion); // Ruta corregida
router.put("/update/:id", updateMotion);
router.delete("/delete/:id", deleteMotion);

export default notificationRouter; 