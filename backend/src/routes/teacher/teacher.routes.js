// routes/teacherRoutes.js
import express from 'express';
import { 
    allTeachers,
    singleTeacher,
    createTeacher,
    editTeacher,
    eraseTeacher 
} from '../../controllers/teacher/teacher.controller.js';

const router = express.Router();

// Obtener todos los profesores
router.get('/', allTeachers);

// Obtener un profesor por ID
router.get('/:id', singleTeacher);

// Crear un nuevo profesor
router.post('/', createTeacher);

// Editar un profesor
router.put('/:id', editTeacher);

// Eliminar un profesor
router.delete('/:id', eraseTeacher);

export default router;