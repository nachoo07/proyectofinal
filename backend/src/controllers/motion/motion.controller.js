import connection from "../../db/db.connection.js"
// Get all motions
const allMotions = async  (request, response) => {
    const query = `SELECT * FROM motions`
    const result = await connection.query(query);
    response.send(result[0]);
}

// Get single motion by ID
const singleMotion = async(request, response) => {
    const id = request.params.id
    try {
        console.log("Buscando Movimiento con ID:", id); // Depuración
        const [data] = await connection.execute(
          `SELECT * FROM motions WHERE id = ?`,
          [id]
        );
    
        if (data.length < 1) {
          return response.status(404).send({ error: "Notification not found" });
        }
    
        console.log("Notificación encontrada:", data[0]); // Depuración
        response.send(data[0]);
      } catch (error) {
        console.error("Error fetching Report:", error);
        response.status(500).send({ error: "Error fetching report" });
      }
}

// Create new motion
const createMotion = async (req, res) => {
    const { concept, date, amount, paymentMethod, incomeType } = req.body;
  
    // Asegúrate de validar los valores según los tipos de datos (enum 'efectivo' o 'transferencia')
    if (!["efectivo", "transferencia"].includes(paymentMethod)) {
      return res
        .status(400)
        .json({ error: "El tipo debe ser 'efectivo' o 'transferencia'" });
    }
    if (!["ingreso", "egreso"].includes(incomeType)) {
        return res.status(400).json({ 
            error: "El tipo debe ser 'ingreso' o 'egreso'" 
        });
    }
    if (isNaN(amount) || amount <= 0) {
        return res.status(400).json({ 
            error: "El monto debe ser un número positivo" 
        });
    }

    // Validación de longitud de concept
    if (concept.length > 255) {
        return res.status(400).json({ 
            error: "El concepto debe tener menos de 255 caracteres" 
        });
    }

    // Validación de formato de fecha
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(Date.parse(date))) {
        return res.status(400).json({ 
            error: "La fecha debe estar en formato YYYY-MM-DD y ser válida" 
        });
    }
    // Definir la consulta SQL
    const query = `INSERT INTO motions (concept, date, amount, paymentMethod, incomeType) 
                     VALUES (?, ?, ?, ?,?)`;
  
    try {
      // Ejecutar la consulta con parámetros
      const [result] = await connection.execute(query, [
        concept,
        date,
        amount,
        paymentMethod,
        incomeType,
      ]);
  
      // Devolver la respuesta con los detalles de la notificación creada
      res.status(201).json({
        message: "Movimiento creado correctamente",
        motion: {
          id: result.insertId, // El ID generado automáticamente
          concept,
          date,
          amount,
          paymentMethod,
          incomeType,
        },
      });
    } catch (error) {
      console.error("Error creando el Movimiento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

// Edit existing motion
const updateMotion = async (request, response) => {
    const id = request.params.id
    const { concept, date, amount, paymentMethod, incomeType } = request.body
    console.log('a')
    
    // Basic validation
    if (!concept || !date || !amount || !paymentMethod || !incomeType) {
        return response.status(400).send({ error: 'All fields are required' })
    }
    
    // Validate enums
    if (!['efectivo', 'transferencia'].includes(paymentMethod)) {
        return response.status(400).send({ error: 'Invalid payment method' })
    }
    if (!['ingreso', 'egreso'].includes(incomeType)) {
        return response.status(400).send({ error: 'Invalid income type' })
    }

    // Validate amount
    if (isNaN(amount) || amount < 0) {
        return response.status(400).send({ error: 'Amount must be a positive number' })
    }

    // Validate concept length
    if (concept.length > 255) {
        return response.status(400).send({ error: 'Concept must be less than 255 characters' })
    }

    console.log('b')

    const query = `UPDATE motions 
                  SET concept = ?, 
                      date = ?, 
                      amount = ?, 
                      paymentMethod = ?, 
                      incomeType = ?
                  WHERE id = ?`
    try{
        const result = await connection.execute(query, [concept, date, amount, paymentMethod, incomeType, id])
        const affectedRows = result[0].affectedRows

        if(affectedRows === 0){
            response.status(404).send({ error: 'Motion not found' })
        }
        else {
            response.send({ 
                id,
                concept,
                date,
                amount,
                paymentMethod,
                incomeType
            })
        }
    }catch(error){
        console.error('Error updating motion:', error)
        response.status(500).send({ error: 'Error updating motion' })
    }
    
}

// Delete motion
const deleteMotion = async (req, res) => {
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
      console.error("Error eliminando  Movimiento:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  };
export default  { 
    allMotions, 
    singleMotion, 
    createMotion, 
    updateMotion, 
    deleteMotion
}