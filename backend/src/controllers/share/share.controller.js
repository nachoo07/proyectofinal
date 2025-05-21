import connection from '../../db/db.connection.js';

// Obtener todos los shares
// share.controller.js
export const allShares = async (req, res) => {
    const query = `
    SELECT 
        s.id AS student_id,
        s.name,
        s.lastName,
        sh.id AS share_id,
        sh.date,
        sh.amount,
        sh.state,
        sh.paymentmethod,
        sh.paymentdate
    FROM students s
    LEFT JOIN shares sh ON s.id = sh.student_id
    ORDER BY s.lastName, sh.date DESC
    `;
    try {
        const [rows] = await connection.query(query);
        res.json(rows);
    }catch (err) {
    console.error("Error en la consulta de cuota:", err);
    res.status(500).json({ error: "Error en la consulta" });
    }
};

// Obtener un share por ID
export const singleShare = async (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM shares WHERE id = ?";
    try {
        const [rows] = await connection.query(query, [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: "Share no encontrado" });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error en la consulta" });
    }
};

// Crear un nuevo share
export const createShare = async (req, res) => {
    const { student_id, date, amount, state, paymentmethod, paymentdate } = req.body;
    
    // Validación básica
    if (!student_id || !date || !amount) {
        return res.status(400).json({ error: "Faltan campos obligatorios: student_id, date, amount" });
    }

    const query = `
        INSERT INTO shares (student_id, date, amount, state, paymentmethod, paymentdate)
        VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
        student_id,
        date,
        amount,
        state || 'Pendiente', // Valor por defecto si no se proporciona
        paymentmethod || null,
        paymentdate || null
    ];

    try {
        const [result] = await connection.query(query, values);
        res.status(201).json({
            message: "Share creado exitosamente",
            id: result.insertId
        });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: "El student_id no existe en la tabla students" });
        }
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al crear el share" });
    }
};

// Editar un share
export const editShare = async (req, res) => {
    const { id } = req.params;
    const { student_id, date, amount, state, paymentmethod, paymentdate } = req.body;

    // Validación básica
    if (!student_id || !date || !amount) {
        return res.status(400).json({ error: "Faltan campos obligatorios: student_id, date, amount" });
    }

    const query = `
        UPDATE shares 
        SET 
            student_id = ?,
            date = ?,
            amount = ?,
            state = ?,
            paymentmethod = ?,
            paymentdate = ?
        WHERE id = ?
    `;
    const values = [student_id, date, amount, state || 'Pendiente', paymentmethod || null, paymentdate || null, id];

    try {
        const [result] = await connection.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Share no encontrado" });
        }
        res.json({ message: "Share actualizado exitosamente" });
    } catch (err) {
        if (err.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ error: "El student_id no existe en la tabla students" });
        }
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al actualizar el share" });
    }
};

// Eliminar un share
export const eraseShare = async (req, res) => {
    const { id } = req.params;
    const query = "DELETE FROM shares WHERE id = ?";

    try {
        const [result] = await connection.query(query, [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Share no encontrado" });
        }
        res.json({ message: "Share eliminado exitosamente" });
    } catch (err) {
        console.error("Error en la consulta:", err);
        res.status(500).json({ error: "Error al eliminar el share" });
    }
};

