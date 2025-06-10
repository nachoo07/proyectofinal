import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import { getAllAttendances, createAttendance, updateAttendance, deleteAttendance } from '../../controllers/attendance/attendance.controllers.js';

const router = express.Router();

router.get('/', authenticate, authorizeRole(['admin']), getAllAttendances); // Obtener todos los attendance
router.post('/create', authenticate, authorizeRole(['admin']), createAttendance); // Crear un nuevo attendance
router.put('/update/:id', authenticate, authorizeRole(['admin']), updateAttendance); // Editar un attendance
router.delete('/delete/:id', authenticate, authorizeRole(['admin']), deleteAttendance); // Eliminar un attendance

export default router;