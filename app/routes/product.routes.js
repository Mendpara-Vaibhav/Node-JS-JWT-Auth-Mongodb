const controller = require("../controllers/product.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/add/product", controller.addProduct);
    app.get("/api/product", controller.productList);
    app.get("/api/product/:id", controller.getProductById);
    app.put("/api/update/product/:id", controller.updateProduct);
    app.delete("/api/delete/product/:id", controller.deleteProduct);
};
