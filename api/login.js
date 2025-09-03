import mysql from "mysql2/promise";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

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

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  try{
    const [rows] = await pool.query("SELECT id, email, password FROM accounts WHERE email = ? AND password = ?", [email, password]);

    if(rows.length > 0){

      const token = jwt.sign(
        { id: rows[0].id, email: rows[0].email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
      res.json({message: "Login Succesfull!", token});

    }else{
      res.status(400).json({message: "Invalid Login"});
    }
      
  }catch (err){
    res.status(400).json({message: `Error: ${err}`})
    
  }
});

export default app;
