require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cron = require("node-cron");
const app = express();
const { sequelize } = require("./config/db");
const cors = require("cors");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}`);
  console.log(`Request URL: ${req.url}`);
  console.log(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

// Routes
app.use("/auth", require("./routes/userRoutes"));
app.use("/api", require("./routes/orgRoute"));
console.log(process.env);

if (process.env.NODE_ENV !== "test") {
  sequelize
    .sync({ alter: true })
    .then(() => {
      const port = process.env.PORT || 3000;
      app.listen(port, () => {
        console.log("Server running on port 3000");
      });
    })
    .catch((err) => console.error("Database connection failed: ", err));

  // Cron job to trigger redeployment
  const deployHookUrl =
    "https://api.render.com/deploy/srv-cu8mj2lds78s73bjcar0?key=KWA0m4_WTGk";
  
  // cron.schedule("*/14 * * * *", async () => {
  //   try {
  //     const response = await axios.post(deployHookUrl);
  //     console.log("Deployment triggered", response.data);
  //   } catch (error) {
  //     console.error("Error triggering deployment", error);
  //   }
  });

  process.on("unhandledRejection", (err) => {
    console.log(`An error occurred: ${err.message}`);
  });
}

module.exports = { app };
