import connection  from '../../db/db.connection.js'; // Ajusta la ruta según tu estructura
import bcrypt from 'bcrypt';
import { generateToken } from '../../utils/jwt.js';

// Login de usuario
export const loginUser = async (req, res, next) => {
    const { mail, password } = req.body;

    // Validar campos
    if (!mail || !password) {
        return res.status(400).json({ message: 'Correo y contraseña son requeridos.' });
    }

    try {
        // Buscar usuario por correo
        const [users] = await connection.query('SELECT * FROM users WHERE mail = ?', [mail]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        const user = users[0];

        // Verificar contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const token = generateToken(user);

        // Enviar el token en una cookie
        res.cookie('jwt', token, {
            httpOnly: true, // Protege contra XSS
            secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
            sameSite: 'Lax', // Mitiga CSRF
            maxAge: 15 * 60 * 1000 // 15 minutos en milisegundos
        });

        res.status(200).json({
            message: 'Login exitoso',
            user: { id: user.id, name: user.name, mail: user.mail, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

// Logout de usuario
export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('jwt'); // Elimina la cookie
        res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
        next(error);
    }
};

