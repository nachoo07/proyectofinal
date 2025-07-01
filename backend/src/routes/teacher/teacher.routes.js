// src/routes/teacher.js
import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import { allTeachers, singleTeacher, createTeacher, editTeacher, eraseTeacher } from '../../controllers/teacher/teacher.controller.js';

const router = express.Router();

router.get('/', allTeachers); // Obtener todos los profesores
router.get('/:id', singleTeacher); // Obtener un profesor por ID
router.post('/create', createTeacher); // Crear un nuevo profesor
router.put('/edit/:id', editTeacher); // Editar un profesor
router.delete('/delete/:id', eraseTeacher); // Eliminar un profesor


export default router;