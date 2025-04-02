// student.routes.js
import express from 'express';
import { createStudent, getAllStudents ,getStudentById, updateStudent,deleteStudent } from '../../controllers/student/student.controller.js';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

const router = express.Router();


router.post('/create', authenticate, authorizeRole(['admin']), createStudent); // Ruta para crear un estudiante (POST)
router.get('/', authenticate, authorizeRole(['admin']),  getAllStudents); // Ruta para listar todos los estudiantes (GET)
router.get('/:id', authenticate, authorizeRole(['admin']), getStudentById) ; // Ruta para Obtener un solo estudiante por ID
router.put('/update/:id', authenticate, authorizeRole(['admin']), updateStudent) ; //Ruta para editar un estudiante
router.delete('/delete/:id', authenticate, authorizeRole(['admin']), deleteStudent);//Ruta para eliminar un estudiante




export default router;
