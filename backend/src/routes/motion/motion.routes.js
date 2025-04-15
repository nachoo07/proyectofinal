import express from "express";
import {
  createMotion,
  deleteMotion,
  getAllMotion,
  getMotionByMotion,
  updateMotion,
} from "../../controllers/motion/motion.controller.js";
const router = express.Router();

router.get("/", getAllMotion);
router.get("/:id", getMotionByMotion);
router.post("/create", createMotion); 
router.put("/update/:id", updateMotion);
router.delete("/delete/:id", deleteMotion);

export default router;