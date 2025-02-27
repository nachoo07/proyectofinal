import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './src/config/config.js'; // Importa el puerto desde config.js
import pool from './src/db/db.connection.js'; // Conexión a la base de datos MySQL
import StudentRoutes from './src/routes/student/student.routes.js'; // Importa las rutas de estudiantes

const app = express();

// Middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(morgan('dev')); // Logs de solicitudes HTTP
app.use(cors()); // Habilita CORS para permitir solicitudes cross-origin


app.use('/api/student', StudentRoutes); // Rutas de estudiantes

// Ruta base
app.get('/', (req, res) => {
  res.send('API MySQL - Hello World');
});

// Manejo de errores globales (middleware simple, puedes expandirlo)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});

// Manejo de errores globales (opcional, útil para depuración)
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});