import { verifyToken } from '../../utils/jwt.js';

// Middleware para verificar autenticación
export const authenticate = (req, res, next) => {
    let token = req.cookies.jwt; // Intenta obtener de la cookie

    // Si no hay cookie, intenta obtener del header Authorization
    if (!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if (authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'No autenticado. Token no proporcionado.' });
    }

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expirado.' });
        }
        return res.status(401).json({ message: 'Token inválido.' });
    }
};

// Middleware para verificar rol
export const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No tienes permiso para acceder a esta ruta.' });
        }
        next();
    };
};

