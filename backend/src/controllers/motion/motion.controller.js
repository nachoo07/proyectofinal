import connection from "../../db/db.connection.js";

// Función auxiliar para crear un ingreso automático
const createAutomaticIncome = async (concept, date, amount, paymentMethod) => {
  const incomeQuery = `INSERT INTO motions (concept, date, amount, paymentMethod, incomeType) 
                      VALUES (?, ?, ?, ?, ?, ?)`;
  const incomeConcept = `Ingreso automático por cuota: ${concept}`;
  try {
    const [result] = await connection.execute(incomeQuery, [
      incomeConcept,
      date,
      amount,
      paymentMethod,
      "ingreso",
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
    response.status(200).json({motions: result[0]});
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    response.status(500).json({ error: 'Error al obtener movimientos' });
  }
};
export const getMotionsByQuarter = async (request, response) => {
  try {
    const { type, page = 1, pageSize = 10 } = request.query;

    // Validar type
    if (type && !["ingreso", "egreso"].includes(type)) {
      return response.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'" });
    }

    // Validar page y pageSize
    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
      return response.status(400).json({ error: "page y pageSize deben ser números positivos" });
    }

    const query = `
      SELECT 
          YEAR(date) AS year,
          QUARTER(date) AS quarter,
          incomeType,
          COUNT(*) AS motion_count,
          SUM(amount) AS total_amount
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
      GROUP BY YEAR(date), QUARTER(date), incomeType
      ORDER BY year DESC, quarter DESC
      LIMIT ? OFFSET ?
    `;
    const queryParams = type ? [type, parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)] : [parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)];

    // Query para contar el total de grupos
    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(YEAR(date), QUARTER(date), incomeType)) as count
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
    `;
    const countParams = type ? [type] : [];

    // Ejecutar consultas
    const [result] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(countQuery, countParams);

    // Enviar resultados
    response.status(200).json({
      motions: result,
      count: countResult[0].count
    });
  } catch (error) {
    console.error("Error al obtener movimientos por trimestre:", error);
    response.status(500).json({ error: "Error al obtener movimientos por trimestre" });
  }
};
// Obtener movimientos por método de pago con paginación
export const getMotionsByPaymentMethod = async (request, response) => {
  try {
    const { type, page = 1, pageSize = 10 } = request.query;

    // Validar type
    if (type && !["ingreso", "egreso"].includes(type)) {
      return response.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'" });
    }

    // Validar page y pageSize
    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
      return response.status(400).json({ error: "page y pageSize deben ser números positivos" });
    }

    const query = `
      SELECT 
          paymentMethod,
          incomeType,
          COUNT(*) AS motion_count,
          SUM(amount) AS total_amount
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
      GROUP BY paymentMethod, incomeType
      ORDER BY paymentMethod, incomeType
      LIMIT ? OFFSET ?
    `;
    const queryParams = type ? [type, parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)] : [parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)];

    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(paymentMethod, incomeType)) as count
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
    `;
    const countParams = type ? [type] : [];

    const [result] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(countQuery, countParams);

    response.status(200).json({
      motions: result,
      count: countResult[0].count
    });
  } catch (error) {
    console.error("Error al obtener movimientos por método de pago:", error);
    response.status(500).json({ error: "Error al obtener movimientos por método de pago" });
  }
};
// Obtener movimientos por mes con paginación
export const getMotionsByMonth = async (request, response) => {
  try {
    const { type, page = 1, pageSize = 10 } = request.query;

    // Validar type
    if (type && !["ingreso", "egreso"].includes(type)) {
      return response.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'" });
    }

    // Validar page y pageSize
    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
      return response.status(400).json({ error: "page y pageSize deben ser números positivos" });
    }

    const query = `
      SELECT 
          YEAR(date) AS year,
          MONTH(date) AS month,
          MONTHNAME(date) AS month_name,
          incomeType,
          COUNT(*) AS motion_count,
          SUM(amount) AS total_amount
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
      GROUP BY YEAR(date), MONTH(date), incomeType
      ORDER BY year DESC, month DESC
      LIMIT ? OFFSET ?
    `;
    const queryParams = type ? [type, parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)] : [parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)];

    // Query para contar el total de grupos
    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(YEAR(date), MONTH(date), incomeType)) as count
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
    `;
    const countParams = type ? [type] : [];

    // Ejecutar consultas
    const [result] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(countQuery, countParams);

    // Enviar resultados
    response.status(200).json({
      motions: result,
      count: countResult[0].count
    });
  } catch (error) {
    console.error("Error al obtener movimientos por mes:", error);
    response.status(500).json({ error: "Error al obtener movimientos por mes" });
  }
};

// Obtener movimientos por semana con paginación
export const getMotionsByWeek = async (request, response) => {
  try {
    const { type, page = 1, pageSize = 10 } = request.query;

    // Validar type
    if (type && !["ingreso", "egreso"].includes(type)) {
      return response.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'" });
    }

    // Validar page y pageSize
    if (isNaN(page) || page < 1 || isNaN(pageSize) || pageSize < 1) {
      return response.status(400).json({ error: "page y pageSize deben ser números positivos" });
    }

    const query = `
      SELECT 
          YEAR(date) AS year,
          WEEK(date, 1) AS week,
          incomeType,
          COUNT(*) AS motion_count,
          SUM(amount) AS total_amount
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
      GROUP BY YEAR(date), WEEK(date, 1), incomeType
      ORDER BY year DESC, week DESC
      LIMIT ? OFFSET ?
 Juno
    `;
    const queryParams = type ? [type, parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)] : [parseInt(pageSize), (parseInt(page) - 1) * parseInt(pageSize)];

    // Query para contar el total de grupos
    const countQuery = `
      SELECT COUNT(DISTINCT CONCAT(YEAR(date), WEEK(date, 1), incomeType)) as count
      FROM motions
      ${type ? 'WHERE incomeType = ?' : ''}
    `;
    const countParams = type ? [type] : [];

    // Ejecutar consultas
    const [result] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(countQuery, countParams);

    // Enviar resultados
    response.status(200).json({
      motions: result,
      count: countResult[0].count
    });
  } catch (error) {
    console.error("Error al obtener movimientos por semana:", error);
    response.status(500).json({ error: "Error al obtener movimientos por semana" });
  }
};
// Get all motions
export const getAllMotionPaginated = async (request, response) => {
  try {
    // Recibimos filtros y paginación desde query params
    const {
      type,            // ingreso / egreso
      paymentMethod,   // efectivo / transferencia
      dateFrom,        // YYYY-MM-DD
      dateTo,          // YYYY-MM-DD
      amountMin,       // número
      amountMax,       // número
      page = 1,
      pageSize = 10,
    } = request.query;

    // Validaciones básicas (puedes agregar más si querés)
    if (type && !["ingreso", "egreso"].includes(type)) {
      return response.status(400).json({ error: "El tipo debe ser 'ingreso' o 'egreso'" });
    }
    if (paymentMethod && !["efectivo", "transferencia"].includes(paymentMethod)) {
      return response.status(400).json({ error: "Método de pago inválido" });
    }
    const pageNum = parseInt(page);
    const limit = parseInt(pageSize);
    if (isNaN(pageNum) || pageNum < 1 || isNaN(limit) || limit < 1) {
      return response.status(400).json({ error: "page y pageSize deben ser números positivos" });
    }

    // Construir consulta dinámica
    let query = "SELECT * FROM motions WHERE 1=1";
    let queryCount = "SELECT COUNT(id) AS count FROM motions WHERE 1=1";
    const queryParams = [];
    const countParams = [];

    if (type) {
      query += " AND incomeType = ?";
      queryCount += " AND incomeType = ?";
      queryParams.push(type);
      countParams.push(type);
    }

    if (paymentMethod) {
      query += " AND paymentMethod = ?";
      queryCount += " AND paymentMethod = ?";
      queryParams.push(paymentMethod);
      countParams.push(paymentMethod);
    }

    if (dateFrom) {
      query += " AND date >= ?";
      queryCount += " AND date >= ?";
      queryParams.push(dateFrom);
      countParams.push(dateFrom);
    }

    if (dateTo) {
      query += " AND date <= ?";
      queryCount += " AND date <= ?";
      queryParams.push(dateTo);
      countParams.push(dateTo);
    }

    if (amountMin) {
      query += " AND amount >= ?";
      queryCount += " AND amount >= ?";
      queryParams.push(amountMin);
      countParams.push(amountMin);
    }

    if (amountMax) {
      query += " AND amount <= ?";
      queryCount += " AND amount <= ?";
      queryParams.push(amountMax);
      countParams.push(amountMax);
    }

    // Ordenar y paginar
    query += " ORDER BY id DESC LIMIT ? OFFSET ?";
    queryParams.push(limit, (pageNum - 1) * limit);

    // Ejecutar consultas
    const [motionsResult] = await connection.query(query, queryParams);
    const [countResult] = await connection.query(queryCount, countParams);

    const totalCount = countResult[0].count;

    // Enviar resultados con paginación
    response.status(200).json({
      motions: motionsResult,
      totalItems: totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: pageNum,
    });

  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    response.status(500).json({ error: "Error al obtener movimientos" });
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
  const { concept, date, amount, paymentMethod, incomeType } = req.body;

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

  try {
    // Crear el movimiento original
    const query = `INSERT INTO motions (concept, date, amount, paymentMethod, incomeType) 
                   VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.execute(query, [
      concept,
      date,
      amount,
      paymentMethod,
      incomeType,
    ]);

    // Devolver respuesta
    res.status(201).json({
      message: "Movimiento creado correctamente",
      motion: {
        id: result.insertId,
        concept,
        date,
        amount,
        paymentMethod,
        incomeType
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
  const { concept, date, amount, paymentMethod, incomeType } = req.body;

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

  try {
    // Actualizar el movimiento original
    const query = `UPDATE motions 
                   SET concept = ?, 
                       date = ?, 
                       amount = ?, 
                       paymentMethod = ?, 
                       incomeType = ?
                   WHERE id = ?`;
    const [result] = await connection.execute(query, [
      concept,
      date,
      amount,
      paymentMethod,
      incomeType,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Movimiento no encontrado" });
    }

    res.json({
      id,
      concept,
      date,
      amount,
      paymentMethod,
      incomeType
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