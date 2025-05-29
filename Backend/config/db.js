import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let db;
const connectDB = async () => {
    try {
        const pool = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        console.log('Connected to MySQL database');
        return pool;
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};
export default connectDB;
