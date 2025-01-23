require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User } = require("../models/user_auth");
const { Organisation } = require("../models/Organisation");
const { user_Org } = require("../models/user_org");
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Registration Function
exports.register = async (req, res) => {
  const { firstName, lastName, email, password, phone } = req.body;
  console.log("Received body: ", req.body);

  // Input validation
  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check for existing email
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Validate email format
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    // Validate password format
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include uppercase, lowercase, a digit, and a special character",
      });
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    // Create a new organization for the user
    const org = await Organisation.create({
      name: `${firstName}'s organisation`,
      description: `${firstName}'s personal organisation`,
    });

    // Link user and organisation
    await user_Org.create({
      userId: user.userId,
      orgId: org.orgId,
    });

    // Generate JWT
    const token = { id: user.userId, email: user.email };
    const accessToken = jwt.sign(token, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Return success response with token
    return res.status(201).json({
      status: "success",
      message: "Registration Successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Registration Unsuccessful",
      error: err.message,
    });
  }
};

// Login Function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(422).json({
      errors: [
        { message: "Email is required" },
        { message: "Password is required" },
      ],
    });
  }

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Login unsuccessful. Email not found",
      });
    }

    // Check if password is valid
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "Login unsuccessful. Password incorrect",
      });
    }

    // Generate JWT
    const token = { id: user.userId, email: user.email };
    const accessToken = jwt.sign(token, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });

    // Return success response with token
    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: { accessToken,
             user:{
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      }
            },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "An error occurred during login",
      error: err.message,
    });
  }
};

// Get User Function
exports.getUser = async (req, res) => {
  try {
    const userIdTk = String(req.user.id);
    const userId = req.params.id;

    // Check if user is authorized to access the requested data
    if (userIdTk !== userId) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not allowed to access this user's data",
      });
    }

    // Fetch user from database
    const user = await User.findOne({
      where: { userId: userId },
      include: Organisation,
    });

    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
      });
    }

    // Return user data
    return res.status(200).json({
      status: "success",
      message: "User record retrieved",
      data: {
        userId: user.userId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "Error",
      message: "An error occurred",
    });
  }
};
