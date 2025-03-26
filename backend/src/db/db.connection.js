// db.connection.js
import '../config/config.js'; // Usa import para dotenv (necesita dotenv/config)
import mysql from 'mysql2/promise';

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba la conexión a la base de datos
connection.getConnection()
  .then(connection => {
    console.log('Conexión exitosa a la base de datos MySQL');
    connection.release(); // Libera la conexión
  })
  .catch(err => {
    console.error('Error al conectar a la base de datos:', err);
  });

export default connection;