const { authJwt } = require("../middlewares");
const controller = require("../controllers/user.controller");
const { verifySignUp } = require("../middlewares");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get("/api/test/user", [authJwt.verifyToken], controller.userBoard);

  app.post(
    "/api/add/user",
    [verifySignUp.checkEmptyPasswordOrEmail],
    controller.addUsers
  );
  app.get("/api/user", controller.usersList);
  app.get("/api/test/user/:id", controller.getUserById);
  app.put("/api/update/user/:id", controller.updateUsers);
  app.delete("/api/delete/user/:id", controller.deleteUsers);
  app.post("/api/send-email", controller.sendEmail);

  app.get(
    "/api/test/mod",
    [authJwt.verifyToken, authJwt.isModerator],
    controller.moderatorBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );
};
