import mysql from "mysql2/promise";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://geofinder-rd.vercel.app",   
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const pool = mysql.createPool({
  host: process.env.HOST, 
  user: process.env.USER, 
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: Number(process.env.PORT),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
})

app.get("/api/login", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM accounts");
    res.json(rows);
  } catch (err) {
    console.error("Database query failed:", err); // log the error
    res.status(400).json({ message: "Database query failed", error: err.message });
  }
});

export { pool };
export default app;
