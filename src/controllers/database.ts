import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import sql from 'mssql';

dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

export const config: sql.config = {
  user: process.env.USER_SERVER,
  password: process.env.PASSWORD_SERVER,
  server: process.env.HOST_SERVER || 'localhost',
  database: process.env.DATABASE_SERVER,
  options: {
    encrypt: true, 
    trustServerCertificate: true,
  },
};
