import rateLimit, { MemoryStore } from 'express-rate-limit';
import logger from '../../utils/logger.js';

export const rateLimitStore = new MemoryStore();

export const loginRateLimiter = rateLimit({
  store: rateLimitStore,
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo 5 intentos por IP
  message: 'Demasiados intentos de login. Intenta de nuevo en 15 minutos.',
});