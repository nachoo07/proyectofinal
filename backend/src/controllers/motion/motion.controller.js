import connection from "../../db/db.connection.js";

// Función auxiliar para crear un ingreso automático
const createAutomaticIncome = async (concept, date, amount, paymentMethod, id_shares) => {
  const incomeQuery = `INSERT INTO motions (concept, date, amount, paymentMethod, incomeType, id_shares) 
                      VALUES (?, ?, ?, ?, ?, ?)`;
  const incomeConcept = `Ingreso automático por cuota: ${concept}`;
  try {
    const [result] = await connection.execute(incomeQuery, [
      incomeConcept,
      date,
      amount,
      paymentMethod,
      "ingreso",
      id_shares,
    ]);
    return result.insertId;
  } catch (error) {
    console.error("Error creando ingreso automático:", error);
    throw new Error("Error creando ingreso automático");
  }
};

// Get all motions
export const getAllMotion = async (request, response) => {
  try {
    const { type } = request.query; // Obtener el parámetro 'type' de la URL
    let query = 'SELECT * FROM motions';
    let queryParams = [];

    // Si se proporciona el parámetro 'type', agregar un WHERE
    if (type) {
      query += ' WHERE incomeType = ?';
      queryParams.push(type);
    }

    // Ejecutar la consulta
    const result = await connection.query(query, queryParams);

    // Enviar los resultados como JSON
    response.status(200).json(result[0]);
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    response.status(500).json({ error: 'Error al obtener movimientos' });
  }
};

// Get single motion by ID
export const getMotionByMotion = async(request, response) => {
    const id = request.params.id
    try {
        console.log("Buscando Movimiento con ID:", id); // Depuración
        const [data] = await connection.execute(
          `SELECT * FROM motions WHERE id = ?`,
          [id]
        );
    
        if (data.length < 1) {
          return response.status(404).send({ error: "Motion not found" });
        }
    
        console.log("Movimiento encontrado:", data[0]); // Depuración
        response.send(data[0]);
      } catch (error) {
        console.error("Error fetching Report:", error);
        response.status(500).send({ error: "Error fetching report" });
      }
}

// Create new motion
export const createMotion = async (req, res) => {
  const { concept, date, amount, paymentMethod, incomeType, id_shares } = req.body;

  // Validar paymentMethod
  if (!["efectivo", "transferencia"].includes(paymentMethod)) {
    return res
      .status(400)
      .json({ error: "El tipo debe ser 'efectivo' o 'transferencia'" });
  }

  // Validar incomeType
  if (!["ingreso", "egreso"].includes(incomeType)) {
    return res.status(400).json({
      error: "El tipo debe ser 'ingreso' o 'egreso'",
    });
  }

  // Validar amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      error: "El monto debe ser un número positivo",
    });
  }

  // Validar concept length
  if (concept.length > 255) {
    return res.status(400).json({
      error: "El concepto debe tener menos de 255 caracteres",
    });
  }

  // Validar formato de fecha
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: "La fecha debe estar en formato YYYY-MM-DD y ser válida",
    });
  }

  // Validar id_shares (opcional, puede ser nulo)
  if (id_shares && (isNaN(id_shares) || id_shares <= 0)) {
    return res.status(400).json({
      error: "id_shares debe ser un número positivo o nulo",
    });
  }

  try {
    // Crear el movimiento original
    const query = `INSERT INTO motions (concept, date, amount, paymentMethod, incomeType, id_shares) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [
      concept,
      date,
      amount,
      paymentMethod,
      incomeType,
      id_shares || null,
    ]);

    // Si el movimiento tiene id_shares y es un egreso, crear un ingreso automático
    if (id_shares && incomeType === "egreso") {
      await createAutomaticIncome(concept, date, amount, paymentMethod, id_shares);
    }

    // Devolver respuesta
    res.status(201).json({
      message: "Movimiento creado correctamente",
      motion: {
        id: result.insertId,
        concept,
        date,
        amount,
        paymentMethod,
        incomeType,
        id_shares: id_shares || null,
      },
    });
  } catch (error) {
    console.error("Error creando el Movimiento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Edit existing motion
export const updateMotion = async (req, res) => {
  const id = req.params.id;
  const { concept, date, amount, paymentMethod, incomeType, id_shares } = req.body;

  // Validaciones básicas
  if (!concept || !date || !amount || !paymentMethod || !incomeType) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  // Validar paymentMethod
  if (!["efectivo", "transferencia"].includes(paymentMethod)) {
    return res.status(400).json({ error: "El tipo debe ser 'efectivo' o 'transferencia'" });
  }

  // Validar incomeType
  if (!["ingreso", "egreso"].includes(incomeType)) {
    return res.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'" });
  }

  // Validar amount
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "El monto debe ser un número positivo" });
  }

  // Validar concept length
  if (concept.length > 255) {
    return res.status(400).json({ error: "El concepto debe tener menos de 255 caracteres" });
  }

  // Validar formato de fecha
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
    return res.status(400).json({
      error: "La fecha debe estar en formato YYYY-MM-DD y ser válida",
    });
  }

  // Validar id_shares (opcional, puede ser nulo)
  if (id_shares && (isNaN(id_shares) || id_shares <= 0)) {
    return res.status(400).json({
      error: "id_shares debe ser un número positivo o nulo",
    });
  }

  try {
    // Actualizar el movimiento original
    const query = `UPDATE motions 
                   SET concept = ?, 
                       date = ?, 
                       amount = ?, 
                       paymentMethod = ?, 
                       incomeType = ?,
                       id_shares = ?
                   WHERE id = ?`;
    const [result] = await connection.execute(query, [
      concept,
      date,
      amount,
      paymentMethod,
      incomeType,
      id_shares || null,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    // Si el movimiento tiene id_shares y es un egreso, crear un ingreso automático
    if (id_shares && incomeType === "egreso") {
      await createAutomaticIncome(concept, date, amount, paymentMethod, id_shares);
    }

    res.json({
      id,
      concept,
      date,
      amount,
      paymentMethod,
      incomeType,
      id_shares: id_shares || null,
    });
  } catch (error) {
    console.error("Error actualizando el movimiento:", error);
    res.status(500).json({ error: "Error actualizando el movimiento" });
  }
};

// Delete motion
export const deleteMotion = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID desde los parámetros de la URL

  const query = `DELETE FROM motions WHERE id = ?`;

  try {
    // Ejecutar la consulta para eliminar la notificación
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      // Si no se encontró la notificación con ese ID
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    // Si la eliminación fue exitosa
    res.json({ message: "Movimiento eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando Movimiento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};