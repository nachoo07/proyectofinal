// student.routes.js
import express from 'express';
import { createStudent, getAllStudents ,getStudentById, updateStudent,deleteStudent } from '../../controllers/student/student.controller.js';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

const router = express.Router();


router.post('/create', createStudent); // Ruta para crear un estudiante (POST)
router.get('/',  getAllStudents); // Ruta para listar todos los estudiantes (GET)
router.get('/:id', getStudentById) ; // Ruta para Obtener un solo estudiante por ID
router.put('/update/:id',updateStudent) ; //Ruta para editar un estudiante
router.delete('/:id', deleteStudent);//Ruta para eliminar un estudiante




export default router;
