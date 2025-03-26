// routes/shareRoutes.js
import express from 'express';
import { allShares,singleShare,createShare,editShare,eraseShare } from '../../controllers/share/share.controller.js';

const router = express.Router();


router.get('/', allShares);// Obtener todos los shares
router.get('/:id', singleShare);// Obtener un share por ID
router.post('/create', createShare);// Crear un nuevo share
router.put('/update/:id', editShare);// Editar un share
router.delete('/delete/:id', eraseShare);// Eliminar un share

export default router;