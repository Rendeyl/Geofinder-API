import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";

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

app.post("/api/history", async (req, res) => {
    const {ip, city, region, country, location, timezone, org } = req.body
    try{
        const [rows] = await pool.query("INSERT INTO history (ip, city, region, country, location, timezone, org) VALUES (?, ?, ?, ?, ?, ?, ?)", [ ip, city, region, country, location, timezone, org ]);
        res.status(200).json({ message: "History added successfully" });
    }catch (err){
        res.status(500).json({ message: "Error adding history" });
        console.log(err);
    }
});

app.get("/api/history", async (req, res) => {
  try{
    const [rows] = await pool.query("SELECT id, ip, city, region, country, location, timezone, org FROM history ORDER BY id DESC");
    res.json(rows);
  }catch (err){
    res.status(400).json({message: "Error"});
  }
});

app.delete("/api/history", async (req, res) => {
  const { id } = req.query.id;

  try {
    const [result] = await pool.query("DELETE FROM history WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "History not found" });
    }

    res.status(200).json({ message: "History deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting history" });
  }
});

export default app;