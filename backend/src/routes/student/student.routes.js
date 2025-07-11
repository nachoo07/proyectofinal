import { Router } from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../../controllers/student/student.controller.js";
import upload from "../../Middleware/multer.config.js";
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

const router = Router();

router.get("/", authenticate, authorizeRole(['admin']), getAllStudents);
router.get("/:id", authenticate, authorizeRole(['admin']), getStudentById);
router.post("/create", authenticate, authorizeRole(['admin']), upload.single("profileImage"), createStudent);
router.put("/:id", authenticate, authorizeRole(['admin']), upload.single("profileImage"), updateStudent);
router.delete("/:id", authenticate, authorizeRole(['admin']), deleteStudent);

export default router;
