import express from 'express';
import { loginUser, logoutUser } from '../../controllers/login/login.controllers.js';


const router = express.Router();

// Rutas públicas
router.post('/login', loginUser);

router.post('/logout', logoutUser);


export default router;