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
