// student.routes.js
import express from 'express';
import { createStudent, getAllStudents ,getStudentById, updateStudent,deleteStudent } from '../../controllers/student/student.controller.js';

const router = express.Router();

// Ruta para crear un estudiante (POST)
router.post('/create', createStudent);

// Ruta para listar todos los estudiantes (GET)
router.get('/', getAllStudents);


// Ruta para Obtener un solo estudiante por ID
router.get('/:id', getStudentById)


//Ruta para editar un estudiante

router.put('/update/:id',updateStudent)

//Ruta para eliminar un estudiante

router.delete('/delete/:id',deleteStudent)

export default router;