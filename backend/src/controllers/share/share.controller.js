// src/controllers/share/share.controller.js
import connection from '../../db/db.connection.js';

// Obtener todos los shares (para el Panel de Cuotas)
export const allShares = async (req, res) => {
  const query = `
    SELECT 
        s.id AS student_id,
        s.name,
        s.lastName,
        s.dni,
        s.state AS student_status,
        sh.id AS share_id,
        sh.date,
        sh.amount,
        sh.state,
        sh.paymentdate AS due_date,
        sh.paymentdate_actual AS payment_date,
        sh.paymentmethod,
        sh.paymentdate AS paymentdate
    FROM students s
    LEFT JOIN shares sh ON s.id = sh.student_id
    ORDER BY s.lastName, s.name, sh.date DESC
  `;
  try {
    const [rows] = await connection.query(query);
    res.json(rows);
  } catch (err) {
    console.error("Error en la consulta de cuotas:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
};

// Obtener un share por ID
export const singleShare = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT 
        sh.*,
        s.name,
        s.lastName,
        s.dni,
        s.state AS student_status
    FROM shares sh
    JOIN students s ON sh.student_id = s.id
    WHERE sh.id = ?
  `;
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

// Obtener todas las cuotas de un alumno específico
export const getSharesByStudent = async (req, res) => {
  const { studentId } = req.params;
  const query = `
    SELECT 
      sh.id AS share_id,
      sh.student_id,
      DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
      sh.amount,
      sh.state,
      DATE_FORMAT(sh.paymentdate, '%Y-%m-%d') AS paymentdate,
      DATE_FORMAT(sh.paymentdate_actual, '%Y-%m-%d') AS paymentdate_actual,
      s.name,
      s.lastName,
      s.dni,
      s.state AS student_status
    FROM shares sh
    JOIN students s ON sh.student_id = s.id
    WHERE sh.student_id = ?
    ORDER BY sh.date DESC
  `;
  try {
    const [rows] = await connection.query(query, [studentId]);
    console.log('Datos devueltos por getSharesByStudent:', rows); // Depuración
    if (rows.length === 0) {
      const studentQuery = "SELECT id, name, lastName, dni, state AS student_status FROM students WHERE id = ?";
      const [studentRows] = await connection.query(studentQuery, [studentId]);
      if (studentRows.length === 0) {
        return res.status(404).json({ error: "Alumno no encontrado" });
      }
      return res.json([...studentRows, ...rows]);
    }
    res.json(rows);
  } catch (err) {
    console.error("Error en la consulta de cuotas del alumno:", err);
    res.status(500).json({ error: "Error en la consulta" });
  }
};

// Crear cuotas masivas
export const createMassShare = async (req, res) => {
  const { quotaName, amount, dueDate, year, studentIds } = req.body;
  console.log('Datos recibidos:', { quotaName, amount, dueDate, year, studentIds });

  if (!quotaName || !amount || !dueDate || !year) {
    return res.status(400).json({ error: "Faltan campos obligatorios: quotaName, amount, dueDate, year" });
  }

  let studentsToProcess = [];
  if (studentIds && studentIds.length > 0) {
    const placeholders = studentIds.map(() => '?').join(',');
    const queryStudents = `SELECT id FROM students WHERE id IN (${placeholders}) AND state = 'activo'`;
    const [rows] = await connection.query(queryStudents, studentIds);
    studentsToProcess = rows;
  } else {
    const queryAllStudents = "SELECT id FROM students WHERE state = 'activo'";
    const [rows] = await connection.query(queryAllStudents);
    studentsToProcess = rows;
  }

  if (studentsToProcess.length === 0) {
    return res.status(400).json({ error: "No hay alumnos activos para crear cuotas" });
  }

  const query = `
    INSERT INTO shares (student_id, date, amount, state, paymentdate, paymentdate_actual, quota_name)
    VALUES (?, CURRENT_DATE, ?, ?, ?, ?, ?)
  `;

  try {
    for (const student of studentsToProcess) {
      const values = [
        student.id,
        amount,
        'Pendiente',
        dueDate,
        null,
        quotaName,
      ];
      console.log('Valores de inserción:', values);
      const [result] = await connection.query(query, values);
      console.log('Resultado de la inserción:', result);
    }
    res.status(201).json({ message: "Cuotas masivas creadas exitosamente" });
  } catch (err) {
    console.error('Error detallado:', err);
    res.status(500).json({ error: "Error al crear cuotas masivas: " + err.message });
  }
};

// Crear un nuevo share
export const createShare = async (req, res) => {
  const { student_id, date, amount, state, paymentdate, paymentdate_actual } = req.body;

  if (!student_id || !date || !amount) {
    return res.status(400).json({ error: "Faltan campos obligatorios: student_id, date, amount" });
  }

  const query = `
    INSERT INTO shares (student_id, date, amount, state, paymentdate, paymentdate_actual)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [
    student_id,
    date,
    amount,
    state || 'Pendiente',
    paymentdate || null,
    paymentdate_actual || null,
  ];

  try {
    const [result] = await connection.query(query, values);
    res.status(201).json({
      message: "Share creado exitosamente",
      id: result.insertId,
    });
  } catch (err) {
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "El student_id no existe en la tabla students" });
    }
    console.error("Error en la consulta:", err);
    res.status(500).json({ error: "Error al crear el share" });
  }
};

// Actualizar un share (renombrado de editShare a updateShare)
export const updateShare = async (req, res) => {
  const { id } = req.params;
  console.log('Intentando actualizar share con id:', id); // Depuración
  const { student_id, date, amount, state, paymentdate, paymentdate_actual } = req.body;

  // Validaciones básicas
  if (!student_id || !date || !amount) {
    return res.status(400).json({ error: "Faltan campos obligatorios: student_id, date, amount" });
  }
  if (isNaN(student_id)) {
    return res.status(400).json({ error: "student_id debe ser un número válido" });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return res.status(400).json({ error: `date '${date}' no cumple con el formato YYYY-MM-DD` });
  }
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "amount debe ser un número positivo" });
  }
  if (paymentdate && !/^\d{4}-\d{2}-\d{2}$/.test(paymentdate)) {
    return res.status(400).json({ error: `paymentdate '${paymentdate}' no cumple con el formato YYYY-MM-DD` });
  }
  if (paymentdate_actual && !/^\d{4}-\d{2}-\d{2}$/.test(paymentdate_actual)) {
    return res.status(400).json({ error: `paymentdate_actual '${paymentdate_actual}' no cumple con el formato YYYY-MM-DD` });
  }

  const query = `
    UPDATE shares 
    SET 
      student_id = ?,
      date = ?,
      amount = ?,
      state = ?,
      paymentdate = COALESCE(?, paymentdate),
      paymentdate_actual = ?
    WHERE id = ?
  `;
  const values = [
    student_id,
    date,
    amount,
    state || 'Pendiente',
    paymentdate || null,
    paymentdate_actual || null,
    id,
  ];

  try {
    const [result] = await connection.query(query, values);
    if (result.affectedRows === 0) {
      console.log('No se encontró share con id:', id); // Depuración
      return res.status(404).json({ error: "Share no encontrado" });
    }
    res.json({ message: "Share actualizado exitosamente" });
  } catch (err) {
    console.error("Error detallado en la consulta:", err);
    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
      return res.status(400).json({ error: "El student_id no existe en la tabla students" });
    } else if (err.code === 'ER_TRUNCATED_WRONG_VALUE') {
      return res.status(400).json({ error: "Valor inválido en uno de los campos (ej. date)" });
    } else if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ error: "Uno de los valores excede el tamaño permitido" });
    }
    res.status(500).json({ error: "Error al actualizar el share", details: err.message });
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

export const updateStudentStatus = async (req, res) => {
  const { studentId } = req.params;
  const { status } = req.body;

  if (!['Activo', 'Inactivo'].includes(status)) {
    return res.status(400).json({ error: 'Estado inválido. Use "Activo" o "Inactivo"' });
  }

  const query = 'UPDATE students SET state = ? WHERE id = ?';
  try {
    const [result] = await connection.query(query, [status, studentId]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Alumno no encontrado' });
    }
    res.json({ message: 'Estado del alumno actualizado exitosamente' });
  } catch (err) {
    console.error('Error al actualizar el estado:', err);
    res.status(500).json({ error: 'Error al actualizar el estado' });
  }
};

