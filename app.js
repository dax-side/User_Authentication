const express = require("express");
const app = express();
const { sequelize } = require("./config/db");
//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//
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
      let port = 3000;
      app.listen(port, () => {
        console.log("Server running on port 3000");
      });
    })
    .catch((err) => console.error("Dabase connection failed: ", err));
  process.on("unhandledRejection", (err) => {
    console.log(`An error occured: ${err.message}`);
  });
}
module.exports = { app };
