import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Usa una variable de entorno en producción
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your_refresh_secret'; // Usa una variable de entorno

// Generar Access Token
export const generateAccessToken = (user) => {
  const payload = {
    userId: user.id,
    name: user.name,
    mail: user.mail,
    role: user.role,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
};

// Generar Refresh Token
export const generateRefreshToken = (user) => {
  const payload = {
    userId: user.id,
    name: user.name,
    mail: user.mail,
    role: user.role,
  };
  return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Verificar Token
export const verifyToken = (token, isRefresh = false) => {
  const secret = isRefresh ? JWT_REFRESH_SECRET : JWT_SECRET;
  return jwt.verify(token, secret);
};