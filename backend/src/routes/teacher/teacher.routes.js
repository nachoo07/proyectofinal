import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import { allTeachers,singleTeacher,createTeacher,editTeacher,eraseTeacher } from '../../controllers/teacher/teacher.controller.js';

const router = express.Router();

router.get('/',authenticate, authorizeRole(['admin']), allTeachers);// Obtener todos los profesores
router.get('/:id',authenticate, authorizeRole(['admin']), singleTeacher);// Obtener un profesor por ID
router.post('/',authenticate, authorizeRole(['admin']), createTeacher);// Crear un nuevo profesor
router.put('/:id',authenticate, authorizeRole(['admin']), editTeacher);// Editar un profesor
router.delete('/:id',authenticate, authorizeRole(['admin']), eraseTeacher);// Eliminar un profesor

export default router;