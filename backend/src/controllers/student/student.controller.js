// student.controller.js
import pool from '../../db/db.connection.js'; // Importa el pool de conexiones desde db.connection.js

// Crear un nuevo estudiante
export const createStudent = async (req, res) => {
  const {
    name,
    lastName,
    cuil,
    birthDate,
    address,
    motherName,
    fatherName,
    motherPhone,
    fatherPhone,
    category,
    mail,
    state,
    fee,
    comment,
    profileImage
  } = req.body;

  try {
    // Validar que los campos obligatorios estén presentes
    if (!name || !lastName || !cuil || !birthDate || !address || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Insertar el estudiante en la tabla
    const [result] = await pool.query(
      'INSERT INTO students (name, lastName, cuil, birthDate, address, motherName, fatherName, motherPhone, fatherPhone, category, mail, state, fee, comment, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, lastName, cuil, birthDate, address, motherName || null, fatherName || null, motherPhone || null, fatherPhone || null, category, mail || null, state || 'Activo', fee || 'pendiente', comment || null, profileImage || 'https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg']
    );

    // Responder con el ID del estudiante creado
    res.status(201).json({ id: result.insertId, message: 'Estudiante creado exitosamente' });
  } catch (err) {
    // Manejar errores específicos, como duplicados en CUIL (clave única)
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El CUIL ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear el estudiante', details: err.message });
  }
};

// Listar todos los estudiantes (GET)
export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los estudiantes', details: err.message });
  }
};