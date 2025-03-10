import express from 'express';
import { getAllUsers, createUser, updateUser, deleteUser, updateUserState } from '../../controllers/user/user.controllers.js';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';

const router = express.Router();

router.get('/', authenticate, authorizeRole(['admin']), getAllUsers);
router.post('/create', authenticate, authorizeRole(['admin']), createUser);
router.put('/update/:id', authenticate, authorizeRole(['admin']), updateUser);
router.delete('/delete/:id',authenticate, authorizeRole(['admin']), deleteUser);
router.patch('/update/:id/state',authenticate, authorizeRole(['admin']), updateUserState);

export default router;