import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import {
  getAllAttendances,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from '../../controllers/attendance/attendance.controllers.js';
import connection from '../../db/db.connection.js'
const router = express.Router();

router.get('/', authenticate, authorizeRole(['admin', 'user']), getAllAttendances); // Obtener todos los attendances
router.post('/create', authenticate, authorizeRole(['admin', 'user']), createAttendance); // Crear un nuevo attendance
router.put('/update', authenticate, authorizeRole(['admin', 'user']), updateAttendance); // Editar un attendance
router.delete('/delete', authenticate, authorizeRole(['admin', 'user']), deleteAttendance); // Eliminar un attendance

export default router;