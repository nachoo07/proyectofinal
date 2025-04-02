import express from 'express';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
import { allShares,singleShare,createShare,editShare,eraseShare } from '../../controllers/share/share.controller.js';

const router = express.Router();


router.get('/',authenticate, authorizeRole(['admin']), allShares);// Obtener todos los shares
router.get('/:id',authenticate, authorizeRole(['admin']), singleShare);// Obtener un share por ID
router.post('/create',authenticate, authorizeRole(['admin']), createShare);// Crear un nuevo share
router.put('/update/:id',authenticate, authorizeRole(['admin']), editShare);// Editar un share
router.delete('/delete/:id',authenticate, authorizeRole(['admin']), eraseShare);// Eliminar un share

export default router;