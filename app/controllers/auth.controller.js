const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user
    .save()
    .then((savedUser) => {
      console.log("✅ User saved:", savedUser);

      if (req.body.roles) {
        console.log("🔍 Finding roles:", req.body.roles);
        Role.find({ name: { $in: req.body.roles } })
          .then((roles) => {
            console.log("✅ Roles found:", roles);
            if (!roles || roles.length === 0) {
              return res.status(400).send({ message: "Roles not found in DB" });
            }
            savedUser.roles = roles.map((role) => role._id);
            return savedUser.save();
          })
          .then(() => {
            console.log("✅ User updated with roles:", savedUser.roles);
            res.send({ message: "User was registered successfully!" });
          })
          .catch((err) => res.status(500).send({ message: err.message }));
      } else {
        Role.findOne({ name: "user" })
          .then((role) => {
            console.log("✅ Default role found:", role);
            if (!role) {
              return res
                .status(500)
                .send({ message: "Default role not found" });
            }
            savedUser.roles = [role._id];
            return savedUser.save();
          })
          .then(() => {
            console.log("✅ User updated with default role");
            res.send({ message: "User was registered successfully!" });
          })
          .catch((err) => res.status(500).send({ message: err.message }));
      }
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

exports.signin = (req, res) => {
  User.findOne({ username: req.body.username })
    .populate("roles", "-__v")
    .then((user) => {
      if (!user) {
        console.log("User not found!");
        return res.status(404).send({ message: "User Not found." });
      }

      console.log("User found:", user); // Debugging user data

      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      console.log("User roles before mapping:", user.roles); // Debugging roles

      const token = jwt.sign({ id: user.id }, config.secret, {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: 86400, // 24 hours
      });

      const authorities = user.roles.map(
        (role) => "ROLE_" + role.name.toUpperCase()
      );
      console.log("User authorities:", authorities);

      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,  
        roles: authorities,
        accessToken: token,
      });
    })
    .catch((err) => {
      console.error("Error in signin:", err);
      res.status(500).send({ message: err.message });
    });
};
