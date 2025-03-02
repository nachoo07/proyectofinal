import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './src/config/config.js'; // Importa el puerto desde config.js
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

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});
