import rateLimit from 'express-rate-limit';
import logger from '../../utils/logger.js';

export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
  onLimitReached: (req) => {
    logger.warn(`Límite de intentos alcanzado para IP: ${req.ip}`);
  },
});