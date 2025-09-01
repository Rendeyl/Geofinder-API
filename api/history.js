import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import pool from "./login.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "https://geofinder-rd.vercel.app",   
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

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

export default app;