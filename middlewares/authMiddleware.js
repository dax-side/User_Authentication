require("dotenv").config();
const jwt = require("jsonwebtoken");
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("AuthHeader", authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      status: "unauthorized",
      message: "Token is missing or invalid",
    });
  }

  const token = authHeader.split(" ")[1];
  console.log("Extracted Token", token);
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    console.log("decoded token ", decoded);
    console.log("Middleware is working", req.user);
    next();
  } catch (err) {
    return res.status(401).json({
      status: "unauthorized",
      message: "invalid token",
    });
  }
};

module.exports = { authMiddleware };
