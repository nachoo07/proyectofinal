import  connection  from '../../db/db.connection.js';

// Obtener todas las asistencias
export const getAllAttendances = async (req, res) => {
    try {
        const [rows] = await connection.query('SELECT * FROM attendances');
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Registrar asistencias para una categoría en una fecha
export const createAttendance = async (req, res) => {
    const { date, category, attendance } = req.body;

    if (!date || !category || !attendance || attendance.length === 0) {
        return res.status(400).json({ message: "Missing required fields or attendance list is empty." });
    }

    try {
        // Check if attendance exists for the date and category
        const [existing] = await connection.query(
            'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ? LIMIT 1',
            [date, category]
        );

        if (existing.length > 0) {
            // Delete existing attendance records for this date and category
            await connection.query(
                'DELETE FROM attendances WHERE DATE(date) = ? AND category = ?',
                [date, category]
            );
        }

        // Insert new attendance records
        const values = attendance.map(student => [
            student.idStudent,
            date,
            category,
            student.present || false
        ]);

        await connection.query(
            'INSERT INTO attendances (student_id, date, category, present) VALUES ?',
            [values]
        );

        const [newRecords] = await connection.query(
            'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ?',
            [date, category]
        );

        res.status(existing.length > 0 ? 200 : 201).json({
            message: existing.length > 0 ? "Attendance updated successfully" : "Attendance recorded successfully",
            attendance: newRecords
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar una asistencia específica dentro de una categoría y fecha
export const updateAttendance = async (req, res) => {
    const { date, category, attendance } = req.body;

    try {
        if (!date || !category) {
            return res.status(400).json({ message: 'Fecha y categoría son requeridas' });
        }

        // Validate that each attendance object contains student_id
        if (!attendance.every(student => student.idStudent)) {
            return res.status(400).json({ message: 'idStudent es requerido para cada estudiante' });
        }

        // Start a transaction
        const connection = await connection.getConnection();
        try {
            await connection.beginTransaction();

            // Delete existing attendance records for this date and category
            const [existing] = await connection.query(
                'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ?',
                [date, category]
            );

            if (existing.length === 0) {
                await connection.rollback();
                return res.status(404).json({ message: 'Asistencia no encontrada' });
            }

            await connection.query(
                'DELETE FROM attendances WHERE DATE(date) = ? AND category = ?',
                [date, category]
            );

            // Insert updated attendance records
            const values = attendance.map(student => [
                student.idStudent,
                date,
                category,
                student.present || false
            ]);

            await connection.query(
                'INSERT INTO attendances (student_id, date, category, present) VALUES ?',
                [values]
            );

            await connection.commit();

            const [updatedRecords] = await connection.query(
                'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ?',
                [date, category]
            );

            res.status(200).json({
                message: 'Asistencia actualizada con éxito',
                attendance: updatedRecords
            });
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar una asistencia completa por fecha y categoría
export const deleteAttendance = async (req, res) => {
    const { date, category } = req.query;

    try {
        const [result] = await connection.query(
            'DELETE FROM attendances WHERE DATE(date) = ? AND category = ?',
            [date, category]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "No attendance record found to delete." });
        }

        res.status(200).json({ message: "Attendance successfully deleted." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};