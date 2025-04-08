const controller = require("../controllers/product.controller");
const express = require("express");
const upload = require("../middlewares/multer.middleware"); // Import multer config

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/add/product", upload, controller.addProduct);
  app.get("/api/product", controller.productList);
  app.get("/api/product/:id", controller.getProductById);
  app.put("/api/update/product/:id", upload, controller.updateProduct);
  app.delete("/api/delete/product/:id", controller.deleteProduct);
};
