import connection from "../../db/db.connection.js";

const allNotifications = async (request, response) => {
  const query = `SELECT * FROM notifications`;

  const result = await connection.query(query);
  response.send(result[0]);
};

const singleNotification = async (request, response) => {
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
const createNotification = async (req, res) => {
  const { type, message, date, expirationDate } = req.body;

  // Asegúrate de validar los valores según los tipos de datos (enum 'event' o 'reminder')
  if (!["event", "reminder"].includes(type)) {
    return res
      .status(400)
      .json({ error: "El tipo debe ser 'event' o 'reminder'" });
  }

  // Definir la consulta SQL
  const query = `INSERT INTO notifications (type, message, date, expirationDate) 
                   VALUES (?, ?, ?, ?)`;

  try {
    // Ejecutar la consulta con parámetros
    const [result] = await connection.execute(query, [
      type,
      message,
      date,
      expirationDate,
    
    ]);

    // Devolver la respuesta con los detalles de la notificación creada
    res.status(201).json({
      message: "Notificación creada correctamente",
      notification: {
        id: result.insertId, // El ID generado automáticamente
        type,
        message,
        date,
        expirationDate,
  
      },
    });
  } catch (error) {
    console.error("Error creando la notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const updateNotification = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID desde los parámetros de la URL
  const { type, message, date, expirationDate } = req.body; // Obtenemos los nuevos valores desde el cuerpo de la solicitud

  // Validar que el tipo de notificación esté dentro de los valores permitidos
  if (!["event", "reminder"].includes(type)) {
    return res
      .status(400)
      .json({ error: "El tipo debe ser 'event' o 'reminder'" });
  }

  const query = `UPDATE notifications 
                   SET type = ?, message = ?, date = ?, expirationDate = ? 
                   WHERE id = ?`;

  try {
    // Ejecutar la consulta con los parámetros necesarios
    const [result] = await connection.execute(query, [
      type,
      message,
      date,
      expirationDate,
      id,
    ]);

    if (result.affectedRows === 0) {
      // Si no se encontró la notificación con ese ID
      return res.status(404).json({ error: "Notificación no encontrada" });
    }

    // Si la actualización fue exitosa
    res.json({
      message: "Notificación actualizada correctamente",
      notification: { id, type, message, date, expirationDate },
    });
  } catch (error) {
    console.error("Error actualizando la notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

const deleteNotification = async (req, res) => {
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

export default {
  allNotifications,
  singleNotification,
  createNotification,
  updateNotification,
  deleteNotification,
};
