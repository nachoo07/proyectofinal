import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '12345678'; // Usa una variable de entorno en producción

// Generar un JWT
export const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, role: user.role }, // Payload con ID y rol
        JWT_SECRET,
        { expiresIn: '15m' } // Token expira en 15 minutos
    );
};

// Verificar un JWT
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
