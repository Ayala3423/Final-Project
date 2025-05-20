// server/db/createDatabase.js
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();

const connection = await mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_ROOT,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
await connection.end();

console.log(`Database "${process.env.DB_NAME}" ensured.`);