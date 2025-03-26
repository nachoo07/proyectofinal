import pool from '../../db/db.connection.js';

// Obtener todos los profesores
export const allTeachers = async (req, res) => {
    const query = "SELECT * FROM teacher";
    try {
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error en la consulta" });
    }
};

// Obtener un profesor por ID
export const singleTeacher = async (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM teacher WHERE id = ?";
    try {
        const [rows] = await pool.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Profesor no encontrado" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error en la consulta" });
    }
};

// Crear un nuevo profesor
export const createTeacher = async (req, res) => {
    const { name, lastName, email, phone } = req.body;
    const query = "INSERT INTO teacher (name, lastName, email, phone) VALUES (?, ?, ?, ?)";
    const values = [name, lastName, email, phone || null];

    try {
        const [result] = await pool.query(query, values);
        res.status(201).json({
            message: "Profesor creado exitosamente",
            id: result.insertId
        });
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al crear el profesor" });
    }
};

// Editar un profesor
export const editTeacher = async (req, res) => {
    const { id } = req.params;
    const { name, lastName, email, phone } = req.body;
    const query = "UPDATE teacher SET name = ?, lastName = ?, email = ?, phone = ? WHERE id = ?";
    const values = [name, lastName, email, phone || null, id];

    try {
        const [result] = await pool.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Profesor no encontrado" });
        }
        res.json({ message: "Profesor actualizado exitosamente" });
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al actualizar el profesor" });
    }
};

// Eliminar un profesor
export const eraseTeacher = async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM teacher WHERE id = ?";

    try {
        const [result] = await pool.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Profesor no encontrado" });
        }
        res.json({ message: "Profesor eliminado exitosamente" });
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al eliminar el profesor" });
    }
};