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
        DATE_FORMAT(sh.date, '%Y-%m-%d') AS date,
        sh.amount,
        sh.state,
        DATE_FORMAT(sh.paymentdate, '%Y-%m-%d') AS paymentdate,
        DATE_FORMAT(sh.paymentdate_actual, '%Y-%m-%d') AS paymentdate_actual,
        sh.paymentmethod,
        sh.quota_name
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
      sh.paymentmethod,
      sh.quota_name,
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
  const { quotaName, amount, date, dueDate } = req.body;
  if (!quotaName || !amount || !date || !dueDate) {
    return res.status(400).json({ error: `Faltan campos: ${!quotaName ? 'quotaName' : ''}${!amount ? ', amount' : ''}${!date ? ', date' : ''}${!dueDate ? ', dueDate' : ''}` });
  }
  if (isNaN(amount) || amount < 0) {
    return res.status(400).json({ error: 'El monto debe ser un número mayor o igual a 0' });
  }

  const studentsQuery = "SELECT id FROM students WHERE state = 'activo'";
  const [students] = await connection.query(studentsQuery);

  if (students.length === 0) {
    return res.status(400).json({ error: 'No hay alumnos activos' });
  }

  const query = `
    INSERT INTO shares (student_id, date, amount, state, paymentdate, paymentdate_actual, quota_name, paymentmethod, createdAt, updatedAt)
    VALUES (?, ?, ?, 'Pendiente', ?, NULL, ?, NULL, NOW(), NOW())
  `;

  try {
    const valuesArray = students.map(student => [
      student.id,
      date,
      amount,
      dueDate,
      quotaName,
    ]);
    for (const values of valuesArray) {
      await connection.query(query, values);
    }
    res.status(201).json({ message: 'Cuotas masivas creadas exitosamente' });
  } catch (err) {
    console.error('Error en la inserción:', err);
    res.status(500).json({ error: 'Error al crear cuotas masivas: ' + err.message });
  }
};

// Crear un nuevo share
export const createShare = async (req, res) => {
  const { student_id, date, amount, state, paymentdate, quotaName, paymentmethod } = req.body;

  if (!student_id || !date || !amount || !quotaName) {
    return res.status(400).json({ error: "Faltan campos obligatorios: student_id, date, amount, quotaName" });
  }

  const query = `
    INSERT INTO shares (student_id, date, amount, state, paymentdate, paymentdate_actual, quota_name, paymentmethod, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, NULL, ?, ?, NOW(), NOW())
  `;
  const values = [
    student_id,
    date,
    amount,
    state || 'Pendiente',
    paymentdate || null,
    quotaName,
    paymentmethod || null, // Método de pago vacío por defecto
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

export const updateShare = async (req, res) => {
  const { id } = req.params;
  const { student_id, date, amount, state, paymentdate, paymentdate_actual, quotaName, paymentmethod } = req.body;

  if (!student_id || !date || !amount || !quotaName) {
    return res.status(400).json({ error: "Faltan campos obligatorios: student_id, date, amount, quotaName" });
  }

  let paymentdateActualFormatted = null;
  if (paymentdate_actual) {
    paymentdateActualFormatted = new Date(paymentdate_actual).toISOString().split('T')[0];
  }

  const query = `
    UPDATE shares 
    SET 
      student_id = ?,
      date = ?,
      amount = ?,
      state = ?,
      paymentdate = ?,
      paymentdate_actual = ?,
      quota_name = ?,
      paymentmethod = ?,
      updatedAt = NOW()
    WHERE id = ?
  `;
  const values = [
    student_id,
    date,
    amount,
    state || 'Pendiente',
    paymentdate || null,
    paymentdateActualFormatted,
    quotaName,
    paymentmethod || null,
    id,
  ];

  try {
    const [result] = await connection.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Share no encontrado" });
    }
    res.json({ message: "Share actualizado exitosamente" });
  } catch (err) {
    console.error("Error detallado en la consulta:", err);
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