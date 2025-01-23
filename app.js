require('dotenv').config(); // Make sure dotenv is loaded

const express = require("express");
const app = express();
const { sequelize } = require("./config/db");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// Routes
app.use("/auth", require("./routes/userRoutes"));
app.use("/api", require("./routes/orgRoute"));

if (process.env.NODE_ENV !== "test") {
  sequelize
    .sync({ alter: true })
    .then(() => {
      const port = process.env.PORT || 3000; // Fallback to 3000 if not set
      console.log(`Using port: ${port}`); // Log to verify the actual port being used

      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((err) => console.error("Database connection failed: ", err));

  process.on("unhandledRejection", (err) => {
    console.log(`An error occurred: ${err.message}`);
  });
}

module.exports = { app };
