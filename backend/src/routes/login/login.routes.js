import express from 'express';
import { loginUser, logoutUser, refreshAccessToken } from '../../controllers/login/login.controllers.js';
import { loginRateLimiter } from '../../Middleware/rateLimit/rateLimit.js';
import { authenticate, authorizeRole } from '../../Middleware/login/auth.js';
const router = express.Router();

// Rutas públicas
router.post('/login', loginRateLimiter, loginUser);

router.post('/logout', logoutUser);

router.post('/refresh', refreshAccessToken);

// Ejemplo de ruta protegida - permite admin y user
router.get('/protected', authenticate, authorizeRole(['admin', 'user']), (req, res) => {
  res.json({ message: 'Ruta protegida', user: req.user });
});

export default router;