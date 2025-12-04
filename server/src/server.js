// server.js
import 'dotenv/config';
import app from './app.js'; // your current express app

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
