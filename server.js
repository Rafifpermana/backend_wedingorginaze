const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const db = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

db.getConnection((err, connection) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
    return;
  }
  console.log("Successfully connected to database");
  connection.release();
});

app.get("/", (req, res) => {
  res.send("API for Wedding Organizer is running...");
});

app.use("/api", require("./routes/api"));

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
