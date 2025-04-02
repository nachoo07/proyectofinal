import connection  from '../../db/db.connection.js'; // Ajusta la ruta según tu estructura
import bcrypt from 'bcrypt';

// Obtener todos los usuarios
export const getAllUsers = async (req, res, next) => {
    console.log('Entrando a getAllUsers, usuario:', req.user);
    try {
        console.log('Ejecutando query a la base de datos');
        const [users] = await connection.query('SELECT id, name, mail, role, state, createdAt, updatedAt FROM users');
        console.log('Query ejecutado, enviando respuesta:', users);
        res.status(200).json(users);
    } catch (error) {
        console.error('Error en getAllUsers:', error);
        next(error);
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res, next) => {
    const { name, mail, password, role } = req.body;

    // Validar campos obligatorios
    if (!name || !mail || !password || !role) {
        return res.status(400).json({ message: 'Todos los campos son requeridos.' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await connection.query(
            'INSERT INTO users (name, mail, password, role) VALUES (?, ?, ?, ?)',
            [name, mail, hashedPassword, role || 'user']
        );
        res.status(201).json({ id: result.insertId, message: 'Usuario creado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }
        next(error); // Pasar el error al middleware global
    }
};

// Actualizar un usuario
export const updateUser = async (req, res, next) => {
    const { id } = req.params;
    const { name, mail, password, role, state } = req.body;

    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        const updates = {};
        if (name) updates.name = name;
        if (mail) updates.mail = mail;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (role) updates.role = role;
        if (state) updates.state = state;

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'No se proporcionaron campos para actualizar.' });
        }

        const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
        const values = Object.values(updates);

        await connection.query(`UPDATE users SET ${setClause} WHERE id = ?`, [...values, id]);
        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'El correo ya está registrado.' });
        }
        next(error);
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res, next) => {
    const { id } = req.params;

    try {
        const [result] = await connection.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Usuario eliminado exitosamente.' });
    } catch (error) {
        next(error);
    }
};

// Actualizar el estado de un usuario
export const updateUserState = async (req, res, next) => {
    const { id } = req.params;
    const { state } = req.body;

    if (!['activo', 'inactivo'].includes(state)) {
        return res.status(400).json({ message: 'El estado debe ser "activo" o "inactivo".' });
    }

    try {
        const [rows] = await connection.query('SELECT * FROM users WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }

        await connection.query('UPDATE users SET state = ? WHERE id = ?', [state, id]);
        res.status(200).json({
            message: `Estado del usuario actualizado a ${state}.`,
            user: { id, state }
        });
    } catch (error) {
        next(error);
    }
};