import connection from "../db/db.connection.js";

const checkBirthdays = async () => {
  console.log("Verificando cumpleaños...");
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // Meses en JS son 0-11
    const day = today.getDate();

    const [students] = await connection.query(
      `SELECT id, name, lastName
         FROM students
         WHERE MONTH(birthDate) = ? AND DAY(birthDate) = ? AND state = 'activo'`,
      [month, day]
    );

    for (const student of students) {
      const message = `¡Hoy es el cumpleaños de ${student.name} ${student.lastName}!`;
      await connection.execute(
        `INSERT INTO notifications (type, message, date, expirationDate)
           VALUES ('event', ?, CURDATE(), CURDATE())`,
        [message]
      );
      console.log(`Notificación de cumpleaños creada para ${student.name}`);
    }
  } catch (error) {
    console.error("Error verificando cumpleaños:", error);
  }
};

// Verificar cuotas impagas
const checkUnpaidShares = async () => {
  console.log("Verificando cuotas...");
  try {
    const [shares] = await connection.query(
      `SELECT s.id, s.student_id, s.amount, s.state, s.date, st.name, st.lastName
         FROM shares s
         JOIN students st ON s.student_id = st.id
         WHERE s.state IN ('Pendiente', 'Vencido') AND s.date <= CURDATE()`
    );

    for (const share of shares) {
      const status = share.state === "Vencido" ? "vencida" : "pendiente";
      const message = `Cuota de ${share.name} ${share.lastName} por $${share.amount} está ${status}.`;
      await connection.execute(
        `INSERT INTO notifications (type, message, date, expirationDate)
           VALUES ('reminder', ?, CURDATE(), DATE_ADD(CURDATE(), INTERVAL 7 DAY))`,
        [message]
      );
      console.log(`Notificación de cuota creada para ${share.name}`);
    }
  } catch (error) {
    console.error("Error verificando cuotas:", error);
  }
};


export { checkBirthdays, checkUnpaidShares };
