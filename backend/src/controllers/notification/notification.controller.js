import connection from "../../db/db.connection.js";

import dayjs from 'dayjs';

// Asumiendo que estás recibiendo la fecha como string ISO (por ejemplo: "2025-04-22T03:00:00.000Z")

export const getAllNotification = async (request, response) => {
  const query = `SELECT * FROM notifications`;

  const result = await connection.query(query);
  response.send(result[0]);
};

export const getNotificicationByNotification = async (request, response) => {
  const id = request.params.id;

  try {
    console.log("Buscando notificación con ID:", id); // Depuración
    const [data] = await connection.execute(
      `SELECT * FROM notifications WHERE id = ?`,
      [id]
    );

    if (data.length < 1) {
      return response.status(404).send({ error: "Notification not found" });
    }

    console.log("Notificación encontrada:", data[0]); // Depuración
    response.send(data[0]);
  } catch (error) {
    console.error("Error fetching notification:", error);
    response.status(500).send({ error: "Error fetching notification" });
  }
};

export const createNotification = async (req, res) => {
  const { type, message, date, expirationDate } = req.body;

  // Validar el tipo (enum 'event' o 'reminder')
  if (!["event", "reminder"].includes(type)) {
    return res
      .status(400)
      .json({ error: "El tipo debe ser 'event' o 'reminder'" });
  }

  // Validar y formatear expirationDate
  let formattedExpirationDate;
  if (expirationDate) {
    try {
      formattedExpirationDate = new Date(expirationDate)
        .toISOString()
        .slice(0, 19)
        .replace('T', ' ');
    } catch (error) {
      return res
        .status(400)
        .json({ error: "Formato de expirationDate inválido" });
    }
  } else {
    return res
      .status(400)
      .json({ error: "expirationDate es requerido" });
  }

  // Definir la consulta SQL
  const query = `INSERT INTO notifications (type, message, date, expirationDate) 
                 VALUES (?, ?, ?, ?)`;

  try {
    // Ejecutar la consulta con parámetros
    const [result] = await connection.execute(query, [
      type,
      message,
      date ? new Date(date).toISOString().slice(0, 19).replace('T', ' ') : new Date().toISOString().slice(0, 19).replace('T', ' '), // Formatear también la fecha 'date'
      formattedExpirationDate,
    ]);

    return res.status(201).json({ message: "Notificación creada exitosamente", id: result.insertId });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error al crear la notificación" });
  }
};

export const updateNotification = async (req, res) => {
  const { id } = req.params;
  const { type, message, date, expirationDate } = req.body;

  // Validar el tipo antes de hacer nada
  if (!["event", "reminder"].includes(type)) {
    return res.status(400).json({ error: "El tipo debe ser 'event' o 'reminder'" });
  }

  // Formatear la fecha a un formato válido para MySQL
  const formattedDate = dayjs(expirationDate).format('YYYY-MM-DD HH:mm:ss');

  const query = `
    UPDATE notifications 
    SET type = ?, message = ?, expirationDate = ? 
    WHERE id = ?
  `;

  try {
    const [result] = await connection.execute(query, [
      type,
      message,
      formattedDate,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    res.json({
      message: "Notificación actualizada correctamente",
      notification: { id, type, message, date, expirationDate },
    });
  } catch (error) {
    console.error("Error actualizando la notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deleteNotification = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID desde los parámetros de la URL

  const query = `DELETE FROM notifications WHERE id = ?`;

  try {
    // Ejecutar la consulta para eliminar la notificación
    const [result] = await connection.execute(query, [id]);

    if (result.affectedRows === 0) {
      // Si no se encontró la notificación con ese ID
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    // Si la eliminación fue exitosa
    res.json({ message: "Notificación eliminada correctamente" });
  } catch (error) {
    console.error("Error eliminando la notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


