import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import { allShares, singleShare, createShare, updateShare, eraseShare, getSharesByStudent, createMassShare, updateStudentStatus } from '../../controllers/share/share.controller.js';

const router = express.Router();

router.get('/', allShares); // Obtener todos los shares
router.get('/:id', singleShare); // Obtener un share por ID
router.get('/student/:studentId', getSharesByStudent); // Nueva ruta: Obtener cuotas de un alumno específico
router.post('/', createShare); // Crear un nuevo share
router.post('/create-mass', createMassShare); // Nueva ruta: Crear cuotas masivas
router.put('/update/:id', updateShare); // Editar un share
router.delete('/delete/:id', eraseShare); // Eliminar un share
router.put('/students/:studentId/status', updateStudentStatus); // Actualizar estado del alumno

export default router;