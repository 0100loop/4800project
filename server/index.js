<<<<<<< HEAD
const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.json({ message: "API is working from 0100 Loop" });
});

app.get('/greetings', (req, res) => {
  res.send('Hello from ParkIt!')
});

app.get('/welcome', (req, res) => {
  res.json({message: "Heyyy, this api works!"});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
=======
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
>>>>>>> feat/first-api
