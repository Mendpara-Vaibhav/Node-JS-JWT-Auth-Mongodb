const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const mongoose = require("mongoose");

exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
};

exports.usersList = (req, res) => {
  User.find({})
    .then((user, err) => {
      if (err) {
        res.status(500).send({ success: false, message: err });
        return;
      }

      if (user) {
        res.status(200).send({ success: true, list: user });
        return;
      }
    })
    .catch((err) => {
      //catch error
    });
};

exports.addUsers = (req, res) => {
  User.insertOne({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
  })
    .then((user, err) => {
      if (err) {
        res.status(500).send({ success: false, message: err });
        return;
      }
      console.log("New user added");

      if (user) {
        res.status(200).send({ success: true, list: user });
        return;
      } else {
        res.status(404).send({ message: "User not found." });
      }
    })
    .catch((err) => {
      //catch error
    });
};

exports.updateUsers = (req, res) => {
  User.findByIdAndUpdate(req.params.id, {
    username: req.body.username,
    email: req.body.email,
  })
    .then((user, err) => {
      if (err) {
        res.status(500).send({ success: false, message: err });
        return;
      }
      console.log("User updated");

      if (user) {
        res.status(200).send({ success: true, user });
        return;
      } else {
        res.status(404).send({ message: "User not found." });
      }
    })
    .catch((err) => {});
};

exports.deleteUsers = (req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then((user, err) => {
      if (err) {
        res.status(500).send({ success: false, message: err });
        return;
      }

      if (!user) {
        res.status(404).send({ message: "User not found." });
        return;
      }
      res.status(200).send({ success: true, message: "User deleted" });
    })
    .catch((err) => {});
};

exports.getUserById = (req, res) => {
  User.findById(req.params.id).then((user, err) => {
    if (err) {
      res.status(500).send({ success: false, message: err });
      return;
    }

    if (!user) {
      res.status(404).send({ message: "User not found." });
      return;
    }

    res.status(200).send({ success: true, user });
  });
  return;
};
