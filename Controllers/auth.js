require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const { User } = require("../models/user_auth");
const { Organisation } = require("../models/Organisation");
const { user_Org } = require("../models/user_org");
const { authMiddleware } = require("../middlewares/authMiddleware");

exports.register = async (req, res, next) => {
  const { firstName, lastName, email, password, phone } = req.body;
  console.log("Received body: ", req.body);

  if (!firstName || !lastName || !email || !password || !phone) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const existingUser = await User.findOne({
      where: { email },
    });
    if (existingUser) {
      return res.status(409).json({
        message: "Email already exists",
      });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
    });

    const org = await Organisation.create({
      name: `${firstName}'s organisation`,
      description: `${firstName}'s personal organisation`,
    });
    await user_Org.create({
      userId: user.userId,
      orgId: org.orgId,
    });
    const tken = { id: user.userId, email: user.email };
    const accessToken = jwt.sign(tken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
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
    res.status(500).json({
      message: "Registration Unsuccessful",
      error: err.message,
    });
  }
};

/**
 *  Login Function
 */

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).json({
        errors: [
          {
            message: "email",
            message: "Email is required",
          },
          {
            message: "password",
            message: "password is required",
          },
        ],
      });
    }
    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({
        status: "error",
        message: "login unsuccessful. Email not found",
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "error",
        message: "login unsuccessful. Password incorrect",
      });
    }
    const tken = { id: user.userId, email: user.email };
    //Check if input are working

    // console.log("userId", user.userId);
    // console.log("Token", user.email);

    const accessToken = jwt.sign(tken, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    console.log("Generated token Payload", tken);

    return res.status(200).json({
      status: "success",
      message: "login successful",
      user,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    return res.status(400).json({
      message: "An error occured",
      error: error.message,
    });
  }
};

/**
 * GetUser
 */

exports.getUser = async (req, res) => {
  try {
    console.log("Token user id " + req.user.id);
    console.log("Request Param Id " + req.params.id);
    const userIdTk = String(req.user.id);
    const userId = req.params.id;
    if (userIdTk !== userId) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not allowed to access this user's data",
      });
    }
    const user = await User.findOne({
      where: { userId: userId },
      include: Organisation,
    });
    if (!user) {
      return res.status(404).json({
        status: "Not found",
        message: "User not found",
        statusCode: 404,
      });
    }
    res.status(200).json({
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
    console.log(error);
    res.status(500).json({
      status: "Error",
      message: "An error occured",
      statusCode: 500,
    });
  }
};
