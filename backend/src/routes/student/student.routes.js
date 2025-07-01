import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../controllers/student/student.controller.js";
import upload from "../../Middleware/multer.config.js";

const router = Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", upload.single("profileImage"), createStudent);
router.put("/:id", upload.single("profileImage"), updateStudent);
router.delete("/:id", deleteStudent);

export default router;
