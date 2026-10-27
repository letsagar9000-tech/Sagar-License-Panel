const express = require("express");
const helmet = require("helmet");
const { Pool } = require("pg");

const app = express();

app.use(helmet());
app.use(express.json());

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : null;

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sagar License Panel API is running"
  });
});

app.get("/api/health", async (req, res) => {
  if (!pool) {
    return res.status(503).json({
      success: false,
      message: "Database is not configured"
    });
  }

  try {
    await pool.query("SELECT 1");
    res.json({
      success: true,
      message: "API and database are connected"
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    res.status(503).json({
      success: false,
      message: "Database connection failed"
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sagar License Panel API running on port ${PORT}`);
});