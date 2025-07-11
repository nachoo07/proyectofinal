import connection from '../../db/db.connection.js';

// Obtener todas las asistencias
export const getAllAttendances = async (req, res) => {
  const { date, category } = req.query;
  try {
    let query = `
      SELECT s.id AS idStudent, s.name, s.lastName, a.date, a.category, a.present
      FROM students s
      LEFT JOIN attendances a ON s.id = a.student_id AND DATE(a.date) = ? AND a.category = ?
      WHERE s.category = ?
    `;
    const params = [date || new Date().toISOString().split('T')[0], category, category];

    const [rows] = await connection.query(query, params);

    // Agrupar estudiantes y su estado de asistencia
    const students = rows.map((row) => ({
      id: row.idStudent,
      name: row.name,
      lastName: row.lastName,
    }));
    const attendance = rows.map((row) => ({
      idStudent: row.idStudent,
      present: row.present !== null ? row.present : null, // Usar null en lugar de false
    }));

    res.status(200).json({ students, attendance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Registrar asistencias para una categoría en una fecha
export const createAttendance = async (req, res) => {
  const { date, category, attendance } = req.body;

  if (!date || !category || !attendance || !Array.isArray(attendance) || attendance.length === 0) {
    return res.status(400).json({ message: "Missing required fields or attendance list is empty." });
  }

  try {
    // Verificar si ya existe asistencia para la fecha y categoría
    const [existing] = await connection.query(
      'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ? LIMIT 1',
      [date, category]
    );

    if (existing.length > 0) {
      // Eliminar registros existentes
      await connection.query(
        'DELETE FROM attendances WHERE DATE(date) = ? AND category = ?',
        [date, category]
      );
    }

    // Insertar nuevos registros de asistencia
    const values = attendance
      .filter((student) => student.present !== null) // Ignorar registros con present: null
      .map((student) => [
        student.idStudent,
        date,
        category,
        student.present,
      ]);

    if (values.length > 0) {
      await connection.query(
        'INSERT INTO attendances (student_id, date, category, present) VALUES ?',
        [values]
      );
    }

    const [newRecords] = await connection.query(
      'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ?',
      [date, category]
    );

    res.status(existing.length > 0 ? 200 : 201).json({
      message: existing.length > 0 ? "Attendance updated successfully" : "Attendance recorded successfully",
      attendance: newRecords,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar una asistencia específica dentro de una categoría y fecha
export const updateAttendance = async (req, res) => {
  const { date, category, attendance } = req.body;

  try {
    if (!date || !category || !Array.isArray(attendance)) {
      return res.status(400).json({ message: 'Fecha, categoría y lista de asistencia son requeridas' });
    }

    if (!attendance.every((student) => student.idStudent)) {
      return res.status(400).json({ message: 'idStudent es requerido para cada estudiante' });
    }

    const connectionInstance = await connection.getConnection();
    try {
      await connectionInstance.beginTransaction();

      // Verificar si existe asistencia
      const [existing] = await connectionInstance.query(
        'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ?',
        [date, category]
      );

      if (existing.length === 0) {
        await connectionInstance.rollback();
        return res.status(404).json({ message: 'Asistencia no encontrada' });
      }

      // Eliminar registros existentes
      await connectionInstance.query(
        'DELETE FROM attendances WHERE DATE(date) = ? AND category = ?',
        [date, category]
      );

      // Insertar registros actualizados
      const values = attendance
        .filter((student) => student.present !== null) // Ignorar registros con present: null
        .map((student) => [
          student.idStudent,
          date,
          category,
          student.present,
        ]);

      if (values.length > 0) {
        await connectionInstance.query(
          'INSERT INTO attendances (student_id, date, category, present) VALUES ?',
          [values]
        );
      }

      await connectionInstance.commit();

      const [updatedRecords] = await connectionInstance.query(
        'SELECT * FROM attendances WHERE DATE(date) = ? AND category = ?',
        [date, category]
      );

      res.status(200).json({
        message: 'Asistencia actualizada con éxito',
        attendance: updatedRecords,
      });
    } catch (error) {
      await connectionInstance.rollback();
      throw error;
    } finally {
      connectionInstance.release();
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