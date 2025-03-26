import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './src/config/config.js';
import pool from './src/db/db.connection.js';
import StudentRoutes from './src/routes/student/student.routes.js';
import ShareRoutes from './src/routes/share/share.routes.js'; 
import TeacherRoutes from './src/routes/teacher/teacher.routes.js';

const app = express();

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

app.use('/api/students', StudentRoutes);
app.use('/api/shares', ShareRoutes);
app.use('/api/teachers', TeacherRoutes);

app.get('/', (req, res) => {
  res.send('API MySQL - Hello World');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo salió mal en el servidor' });
});

app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});