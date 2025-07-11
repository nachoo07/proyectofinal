// student.controller.js
import connection from '../../db/db.connection.js'; // Importa el pool de conexiones desde db.connection.js

// Crear un nuevo estudiante
export const createStudent = async (req, res) => {
  const {
    name,
    lastName,
    dni,
    birthDate,
    address,
    motherName,
    fatherName,
    motherPhone,
    fatherPhone,
    category,
    mail,
    state,
    comment,
  } = req.body;

  // Aquí sacamos la imagen subida con multer
  const profileImage = req.file ? req.file.filename : null; // solo nombre de archivo

  try {
    if (!name || !lastName || !dni || !birthDate || !address || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // 🔎 VALIDAR SI EL DNI YA EXISTE
const [existing] = await connection.query('SELECT id FROM students WHERE dni = ?', [dni]);
if (existing.length > 0) {
  return res.status(400).json({ error: 'El estudiante con ese DNI ya existe' });
}


    // Insertamos en la DB con la ruta de la imagen o la URL por defecto
    const [result] = await connection.query(
      `INSERT INTO students 
      (name, lastName, dni, birthDate, address, motherName, fatherName, motherPhone, fatherPhone, category, mail, state, comment, profileImage) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        name,
        lastName,
        dni,
        birthDate,
        address,
        motherName || null,
        fatherName || null,
        motherPhone || null,
        fatherPhone || null,
        category,
        mail || null,
        state || 'Activo',
        comment || null,
        profileImage ? `/uploads/${profileImage}` : 'https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg'
      ]
    );

    res.status(201).json({ id: result.insertId, message: 'Estudiante creado exitosamente' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear el estudiante', details: err.message });
  }
};

// Listar todos los estudiantes (GET)
export const getAllStudents = async (req, res) => {
  try {
    const [rows] = await connection.query('SELECT * FROM students');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar los estudiantes', details: err.message });
  }
};

// Obtener un solo estudiante por ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Error al consultar el estudiante', details: err.message });
  }
};

//  Editar un estudiante
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    lastName,
    dni,
    birthDate,
    address,
    motherName,
    fatherName,
    motherPhone,
    fatherPhone,
    category,
    mail,
    state,
    comment,
  } = req.body;

  // Si se sube una imagen nueva
  const profileImage = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    // Primero obtener el estudiante actual para saber si tiene imagen previa
    const [rows] = await connection.query('SELECT profileImage FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const currentImage = rows[0].profileImage;

     // 🔍 VALIDACIÓN PARA QUE EL DNI NO ESTÉ REPETIDO EN OTRO ESTUDIANTE
    const [existing] = await connection.query('SELECT id FROM students WHERE dni = ? AND id != ?', [dni, id]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro estudiante con ese DNI' });
    }



    // Si no subieron nueva imagen, mantenemos la anterior
    const newImage = profileImage || currentImage || 'https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg';

    const [result] = await connection.query(
      `UPDATE students SET 
        name=?, lastName=?, dni=?, birthDate=?, address=?, motherName=?, fatherName=?, motherPhone=?, fatherPhone=?, category=?, mail=?, state=?, comment=?, profileImage=?
        WHERE id=?`,
      [
        name,
        lastName,
        dni,
        birthDate,
        address,
        motherName || null,
        fatherName || null,
        motherPhone || null,
        fatherPhone || null,
        category,
        mail || null,
        state || 'Activo',
        comment || null,
        newImage,
        id
      ]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    res.json({ message: 'Estudiante actualizado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar el estudiante', details: err.message });
  }
};



//  Eliminar un estudiante
export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await connection.query('DELETE FROM students WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    res.json({ message: 'Estudiante eliminado exitosamente' });
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar el estudiante', details: err.message });
  }
};
