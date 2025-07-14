import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { PORT } from './src/config/config.js'; // Importa el puerto desde config.js
import motionRoutes from './src/routes/motion/motion.routes.js'; // Importa las rutas de motion
import ShareRoutes from './src/routes/share/share.routes.js'; 
import TeacherRoutes from './src/routes/teacher/teacher.routes.js';
import cookieParser from 'cookie-parser'; // Importa cookie-parser
import userRoutes from './src/routes/user/user.routes.js'; // Importa las rutas de usuario
import authRoutes from './src/routes/login/login.routes.js'; // Importa las rutas de autenticación
import studentRoutes from './src/routes/student/student.routes.js'
import attendanceRoutes from './src/routes/attendance/attendance.router.js'; // Importa las rutas de asistencia
import notificationRouter from "./src/routes/notification/notification.routes.js";
import cron from "node-cron";
import schedules from "./src/cronjobs/schedules.js";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173', // Origen de tu frontend
  credentials: true, // Permitir credenciales (cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};
// Middlewares
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(morgan("dev")); // Logs de solicitudes HTTP

app.use(cors(corsOptions)); // Habilita CORS para permitir solicitudes cross-origin
app.use(cookieParser()); // Parsea cookies en las solicitudes

// Rutas
app.use("/api/users", userRoutes); // Rutas de usuario
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api/shares", ShareRoutes);
app.use("/api/teachers", TeacherRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/motion", motionRoutes); // Rutas de motion
app.use("/api/notification", notificationRouter);
app.use('/api/attendance', attendanceRoutes); // Rutas de asistencia

// Ruta base
app.get("/", (req, res) => {
  res.send("API MySQL - Hello World");
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo salió mal en el servidor" });
});

// Iniciar tareas programadas con cron desde el archivo schedules.js
// schedules.js debe exportar un array de objetos con la propiedad cron y task
try {
  schedules.forEach((schedule) => {
    cron.schedule(schedule.cron, schedule.task);
  });
  console.log("Tareas programadas iniciadas");
} catch (error) {
  console.error("Error al programar tareas:", error);
}

app.listen(PORT, () => {
  console.log(`La aplicación está escuchando en el puerto ${PORT}`);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
