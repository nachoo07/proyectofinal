import { verifyToken } from '../../utils/jwt.js';
import logger from '../../utils/logger.js';

export const authenticate = (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
  }

  if (!token || token === 'null' || token === 'undefined') {
    logger.warn('Intento de acceso sin token');
    return res.status(401).json({ message: 'No autenticado. Token no proporcionado.' });
  }

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    logger.error(`Error en autenticación: ${error.message}`);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido o malformado.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado.' });
    }
    return res.status(401).json({ message: 'Error de autenticación.' });
  }
};

export const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      logger.warn(`Acceso denegado para rol: ${req.user.role}`);
      return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
    }
    next();
  };
};