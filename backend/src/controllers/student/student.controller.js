// student.controller.js
import connection from '../../db/db.connection.js'; // Importa el pool de conexiones desde db.connection.js

// Crear un nuevo estudiante
export const createStudent = async (req, res) => {
  console.log("POST /create - Body recibido:", req.body); // LOG inicial para ver datos entrantes

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
    profileImage
  } = req.body;

  try {
    // Validar que los campos obligatorios estén presentes
    if (!name || !lastName || !dni || !birthDate || !address || !category) {
      console.log("Faltan campos obligatorios");
      return res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    // Insertar el estudiante en la tabla
    const [result] = await connection.query(
      'INSERT INTO students (name, lastName, dni, birthDate, address, motherName, fatherName, motherPhone, fatherPhone, category, mail, state, comment, profileImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, lastName, dni, birthDate, address, motherName || null, fatherName || null, motherPhone || null, fatherPhone || null, category, mail || null, state || 'Activo',  comment || null, profileImage || 'https://i.pinimg.com/736x/24/f2/25/24f22516ec47facdc2dc114f8c3de7db.jpg']
    );
    console.log("Estudiante insertado con ID:", result.insertId); // LOG éxito insert

    // Responder con el ID del estudiante creado
    res.status(201).json({ id: result.insertId, message: 'Estudiante creado exitosamente' });
  } catch (err) {
    console.error("Error en createStudent:", err); // LOG error completo
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'El DNI ya está registrado' });
    }
    res.status(500).json({ error: 'Error al crear el estudiante', details: err.message });
  }
};

// Listar todos los estudiantes (GET)
export const getAllStudents = async (req, res) => {
  console.log("GET / - Solicitud para listar todos los estudiantes"); // LOG entrada
  try {
    const [rows] = await connection.query('SELECT * FROM students');
    console.log(`Se encontraron ${rows.length} estudiantes`); // LOG resultado
    res.json(rows);
  } catch (err) {
    console.error("Error en getAllStudents:", err); // LOG error
    res.status(500).json({ error: 'Error al consultar los estudiantes', details: err.message });
  }
};

// Obtener un solo estudiante por ID
export const getStudentById = async (req, res) => {
  const { id } = req.params;
  console.log("GET /:id - Buscar estudiante con ID:", id); // LOG entrada

  try {
    const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log("Estudiante no encontrado con ID:", id);
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }
    console.log("Estudiante encontrado:", rows[0]);
    res.json(rows[0]);
  } catch (err) {
    console.error("Error en getStudentById:", err);
    res.status(500).json({ error: 'Error al consultar el estudiante', details: err.message });
  }
};

//  Editar un estudiante
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const newData = req.body;
  console.log("PUT /update/:id - Actualizar estudiante con ID:", id);
  console.log("Datos nuevos recibidos:", newData);

  try {
    // Primero obtener datos actuales
    const [rows] = await connection.query('SELECT * FROM students WHERE id = ?', [id]);
    if (rows.length === 0) {
      console.log("Estudiante no encontrado para actualizar, ID:", id);
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    const current = rows[0];

    // Preparar datos para actualizar: si no viene un campo, mantenemos el actual
    const updated = {
      name: newData.name || current.name,
      lastName: newData.lastName || current.lastName,
      dni: newData.dni || current.dni,
      birthDate: newData.birthDate || current.birthDate,
      address: newData.address || current.address,
      motherName: newData.motherName || current.motherName,
      fatherName: newData.fatherName || current.fatherName,
      motherPhone: newData.motherPhone || current.motherPhone,
      fatherPhone: newData.fatherPhone || current.fatherPhone,
      category: newData.category || current.category,
      mail: newData.mail || current.mail,
      state: newData.state || current.state,
      comment: newData.comment || current.comment,
      profileImage: newData.profileImage || current.profileImage
    };

    // Ejecutar UPDATE con los datos completos
    const [result] = await connection.query(
      `UPDATE students SET
        name=?, lastName=?, dni=?, birthDate=?, address=?, motherName=?, fatherName=?, motherPhone=?, fatherPhone=?, category=?, mail=?, state=?, comment=?, profileImage=?
       WHERE id=?`,
      [
        updated.name,
        updated.lastName,
        updated.dni,
        updated.birthDate,
        updated.address,
        updated.motherName,
        updated.fatherName,
        updated.motherPhone,
        updated.fatherPhone,
        updated.category,
        updated.mail,
        updated.state,
        updated.comment,
        updated.profileImage,
        id
      ]
    );

    if (result.affectedRows === 0) {
      console.log("No se actualizó ningún registro con ID:", id);
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    console.log("Estudiante actualizado con éxito, ID:", id);
    res.json({ message: 'Estudiante actualizado exitosamente' });

  } catch (err) {
    console.error("Error en updateStudent:", err);
    res.status(500).json({ error: 'Error al actualizar el estudiante', details: err.message });
  }
};

export const deleteStudent = async (req, res) => {
  const { id } = req.params;
  console.log('Recibido pedido para eliminar estudiante con ID:', id); // LOG 1

  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();
    console.log('Transacción iniciada'); // LOG 2

    // Eliminar cuotas relacionadas
    const [deleteCuotas] = await conn.query('DELETE FROM shares WHERE student_id = ?', [id]);
    console.log(`Cuotas eliminadas:`, deleteCuotas.affectedRows); // LOG 3

    // Eliminar estudiante
    const [result] = await conn.query('DELETE FROM students WHERE id = ?', [id]);
    console.log('Resultado de eliminar estudiante:', result); // LOG 4

    if (result.affectedRows === 0) {
      await conn.rollback();
      console.log('Estudiante no encontrado, rollback ejecutado'); // LOG 5
      return res.status(404).json({ error: 'Estudiante no encontrado' });
    }

    await conn.commit();
    console.log('Estudiante y cuotas eliminados exitosamente'); // LOG 6
    res.json({ message: 'Estudiante y cuotas eliminados exitosamente' });

  } catch (err) {
    await conn.rollback();
    console.error('Error en la transacción de eliminación:', err); // LOG 7
    res.status(500).json({ error: 'Error al eliminar estudiante y cuotas', details: err.message });
  } finally {
    conn.release();
  }
};
