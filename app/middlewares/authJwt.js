const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const Role = db.role;

// Middleware to verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers["x-access-token"];
    if (!token) {
      return res.status(403).send({ message: "No token provided!" });
    }

    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).send({ message: "Unauthorized!" });
  }
};

// Middleware to check if user has admin role
const isAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send({ message: "User not found!" });

    const roles = await Role.find({ _id: { $in: user.roles } });
    const isAdmin = roles.some((role) => role.name === "admin");

    if (!isAdmin) {
      return res.status(403).send({ message: "Require Admin Role!" });
    }

    next();
  } catch (err) {
    console.error("isAdmin error:", err.message);
    return res.status(500).send({ message: err.message });
  }
};

// Middleware to check if user has moderator role
const isModerator = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send({ message: "User not found!" });

    const roles = await Role.find({ _id: { $in: user.roles } });
    const isMod = roles.some((role) => role.name === "moderator");

    if (!isMod) {
      return res.status(403).send({ message: "Require Moderator Role!" });
    }

    next();
  } catch (err) {
    console.error("isModerator error:", err.message);
    return res.status(500).send({ message: err.message });
  }
};

// Export all middleware
module.exports = {
  verifyToken,
  isAdmin,
  isModerator,
};
