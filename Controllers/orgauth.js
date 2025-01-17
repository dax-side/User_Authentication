require("dotenv").config();
const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Organisation } = require("../models/Organisation");
const { user_Org } = require("../models/user_org");
const { authMiddleware } = require("../middlewares/authMiddleware");
const { User } = require("../models/user_auth");
const { where } = require("sequelize");

exports.getOrganisations = async (req, res) => {
  try {
    const userId = req.user.id;

    const organisations = await Organisation.findAll({
      include: [
        {
          model: User,
          where: { userId },
          attributes: ["userId", "firstName", "email"],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: ["orgId", "name", "description"],
    });
    if (!organisations.length) {
      return res.status(404).json({
        status: "Not found",
        message: "No organisations found for this user",
        data: [],
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Organisations retrieved successfully",
      data: { organisations },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "An error occured while retrieving organisations",
      error: error.message,
    });
  }
};

/**
 * Single Organisation
 */

exports.getsingleOrganisation = async (req, res) => {
  try {
    console.log("Token User id", req.user.id);
    console.log("Organisation id", req.params.orgId);
    const userIdTk = req.user.id;
    const userId = parseInt(req.params.orgId);
    if (userIdTk !== userId) {
      return res.status(403).json({
        status: "Forbidden",
        message: "You are not allowed to access this user's data",
      });
    }
    const organisation = await Organisation.findOne({
      where: { orgId: req.params.orgId },
    });

    if (!organisation) {
      return res.status(404).json({
        status: "Not found",
        message: "Organisation not found ",
      });
    }
    console.log("Organisation Retrieved", organisation);
    return res.status(200).json({
      status: "success",
      message: "Organisation retrieved successfully",
      data: organisation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "An error occured while retrieving organisation details",
      error: error.message,
    });
  }
};

/**
 * Adds an Existing user to an Existing Organisation
 */
exports.addUserToOrganisation = async (req, res) => {
  try {
    // const {userId} = req.body
    const organisation = await Organisation.findByPk(req.params.orgId);
    if (!organisation) {
      return res.status(404).json({
        status: "fail",
        message: "Organisation not found",
      });
    }
    console.log("body user id", req.body.userId);
    // console.log("user id", req.user);
    console.log("org id", req.params.orgId);
    const user = await User.findByPk(req.body.userId || req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "User not found",
      });
    }
    await user_Org.create({
      userId: user.userId,
      orgId: organisation.orgId,
    });

    return res.status(200).json({
      status: "success",
      message: "User added to Organisation successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.createOrganisation = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return res.status(400).json({
        status: "Bad request",
        message: "Organisation name us required and cannot be null",
        statusCode: 400,
      });
    }
    const organisation = await Organisation.create({
      name: name.trim(),
      description: description,
    });

    return res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: {
        orgId: organisation.orgId,
        name: organisation.name,
        description: organisation.description,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};
