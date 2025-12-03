import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { connectDB } from "./database.js";

dotenv.config();

// Connect to MongoDB BEFORE starting server
connectDB();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
