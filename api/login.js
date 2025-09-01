import mysql from "mysql2/promise";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://anonymessagex.vercel.app",   
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

async function test() {
  try{
        const [rows] = await pool.query("SELECT * FROM accounts");
        console.log(rows);
    }catch (err){
        console.log(err);
    }
}

test()

export { pool };
export default app;
