import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
dotenv.config();
console.log(process.env.DB_NAME+ "hiiiiiiiiiiiiii");

const connection = await mysql.createConnection({
  host: process.env.DB_HOST||'localhost',
  user: process.env.DB_USER||'root',
  password: process.env.DB_PASSWORD|| 'dini327855318', 
  port: process.env.DB_PORT|| '3306',
});

await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
await connection.end();

console.log(`Database "${process.env.DB_NAME}" ensured.`);