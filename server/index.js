const express = require("express");
const app = express();

app.get("/hello", (req, res) => {
  res.json({ message: "API is working from 0100 Loop" });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running at http://localhost:" + port);
});
