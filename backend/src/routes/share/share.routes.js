import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import { allShares, singleShare, createShare, updateShare, eraseShare, getSharesByStudent, createMassShare, updateStudentStatus } from '../../controllers/share/share.controller.js';

const router = express.Router();

router.get('/', authenticate, authorizeRole(['admin']), allShares); // Obtener todos los shares
router.get('/:id', authenticate, authorizeRole(['admin']), singleShare); // Obtener un share por ID
router.get('/student/:studentId', authenticate, authorizeRole(['admin']), getSharesByStudent); // Nueva ruta: Obtener cuotas de un alumno específico
router.post('/create', authenticate, authorizeRole(['admin']), createShare); // Crear un nuevo share
router.post('/create-mass', authenticate, authorizeRole(['admin']), createMassShare); // Nueva ruta: Crear cuotas masivas
router.put('/update/:id', authenticate, authorizeRole(['admin']), updateShare); // Editar un share
router.delete('/delete/:id', authenticate, authorizeRole(['admin']), eraseShare); // Eliminar un share
router.put('/students/:studentId/status', authenticate, authorizeRole(['admin']), updateStudentStatus); // Actualizar estado del alumno



export default router;