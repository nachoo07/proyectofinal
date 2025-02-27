// config.js
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 4000; // Usamos 3000 como en tu ejemplo original, pero puedes cambiarlo a 4000 si prefieres
export const DB_HOST = process.env.DB_HOST;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_NAME = process.env.DB_NAME;
