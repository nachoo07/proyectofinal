// student.routes.js
import express from 'express';
import { createStudent, getAllStudents } from '../../controllers/student/student.controller.js';

const router = express.Router();

// Ruta para crear un estudiante (POST)
router.post('/create', createStudent);

// Ruta para listar todos los estudiantes (GET)
router.get('/', getAllStudents);

export default router;