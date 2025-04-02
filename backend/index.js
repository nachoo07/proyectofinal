import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './src/config/config.js';
import ShareRoutes from './src/routes/share/share.routes.js'; 
import TeacherRoutes from './src/routes/teacher/teacher.routes.js';
import cookieParser from 'cookie-parser'; // Importa cookie-parser
import userRoutes from './src/routes/user/user.routes.js'; // Importa las rutas de usuario
import authRoutes from './src/routes/login/login.routes.js'; // Importa las rutas de autenticación
import studentRoutes from './src/routes/student/student.routes.js'
const app = express();

// Middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(morgan('dev')); // Logs de solicitudes HTTP

app.use(cors()); // Habilita CORS para permitir solicitudes cross-origin
app.use(cookieParser()); // Parsea cookies en las solicitudes

// Rutas
app.use('/api/users', userRoutes); // Rutas de usuario
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/shares', ShareRoutes);
app.use('/api/teachers', TeacherRoutes);
app.use("/api/student" , studentRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API MySQL - Hello World');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log('La aplicación está escuchando en el puerto ${PORT}');
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

