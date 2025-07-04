import connection from '../../db/db.connection.js';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken } from '../../utils/jwt.js';
import { loginSchema } from '../../utils/validators.js';
import logger from '../../utils/logger.js';

// Login de usuario
export const loginUser = async (req, res, next) => {
    try {
        // Validar entrada
        const { error } = loginSchema.validate(req.body);
        if (error) {
            logger.warn(`Error de validación: ${error.details[0].message}`);
            return res.status(400).json({ message: error.details[0].message });
        }

        const { mail, password } = req.body;

        // Buscar usuario
        const [users] = await connection.query('SELECT * FROM users WHERE mail = ?', [mail]);
        if (users.length === 0) {
            logger.warn(`Intento de login con correo no registrado: ${mail}`);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }
        const user = users[0];

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Contraseña incorrecta para el correo: ${mail}`);
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Generar tokens
        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Almacenar refresh token en la base de datos
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
        await connection.query(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, refreshToken, expiresAt]
        );

        // Enviar cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        logger.info(`Usuario logueado: ${mail}`);
        res.status(200).json({
            message: 'Login exitoso',
            user: { id: user.id, name: user.name, mail: user.mail, role: user.role },
        });
    } catch (error) {
        logger.error(`Error en login: ${error.message}`);
        next(error);
    }
};

// Logout de usuario
export const logoutUser = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await connection.query('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
            logger.info('Refresh token eliminado durante logout');
        }

        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
        });

        logger.info('Usuario deslogueado');
        res.status(200).json({ message: 'Usuario deslogueado exitosamente' });
    } catch (error) {
        logger.error(`Error durante logout: ${error.message}`);
        res.status(500).json({ message: 'Error durante logout' });
    }
};

// Refresh Token
export const refreshAccessToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        logger.warn('Intento de refresh sin token');
        return res.status(401).json({ message: 'Refresh token no encontrado.' });
    }

    try {
        // Verificar si el refresh token existe en la base de datos
        const [tokens] = await connection.query('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
        if (tokens.length === 0) {
            logger.warn('Refresh token no válido o revocado');
            return res.status(403).json({ message: 'Refresh token no válido o revocado.' });
        }

        // Verificar token
        const decoded = verifyToken(refreshToken, true);

        // Generar nuevo access token
        const accessToken = generateAccessToken({
            id: decoded.userId,
            name: decoded.name,
            mail: decoded.mail,
            role: decoded.role,
        });

        // Opcional: Rotar refresh token
        const newRefreshToken = generateRefreshToken({
            id: decoded.userId,
            name: decoded.name,
            mail: decoded.mail,
            role: decoded.role,
        });

        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días
        await connection.query(
            'UPDATE refresh_tokens SET token = ?, expires_at = ? WHERE token = ?',
            [newRefreshToken, expiresAt, refreshToken]
        );

        // Enviar nuevas cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 2 * 60 * 60 * 1000, // 2 horas
        });

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
        });

        logger.info(`Access token refrescado para usuario: ${decoded.mail}`);
        res.status(200).json({ message: 'Access token refrescado' });
    } catch (error) {
        logger.error(`Error al refrescar token: ${error.message}`);
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Refresh token expirado.' });
        }
        return res.status(403).json({ message: 'Refresh token inválido.' });
    }

}
