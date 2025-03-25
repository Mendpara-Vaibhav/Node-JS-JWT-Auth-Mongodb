const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  // UsernameA
  User.findOne({
    username: req.body.username,
  })
    .then((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (user) {
        res
          .status(400)
          .send({ message: "Failed! Username is already in use!" });
        return;
      }

      // Email
      User.findOne({
        email: req.body.email,
      })
        .then((err, user) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          if (user) {
            res
              .status(400)
              .send({ message: "Failed! Email is already in use!" });
            return;
          }

          next();
        })
        .catch((err) => {
          //catch error
        });
    })
    .catch((err) => {
      //catch error
    });
};

checkEmptyPasswordOrEmail = (req, res, next) => {
  // Password
  if (!req.body.password) {
    res.status(400).send({ message: "Failed! Password must be provided!" });
    return;
  }
  
  // Email
  if (!req.body.email) {
    res.status(400).send({ message: "Failed! Email must be provided!" });
    return;
  }
  next();
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `Failed! Role ${req.body.roles[i]} does not exist!`,
        });
        return;
      }
    }
  }

  next();
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkRolesExisted,
  checkEmptyPasswordOrEmail,
};

module.exports = verifySignUp;
