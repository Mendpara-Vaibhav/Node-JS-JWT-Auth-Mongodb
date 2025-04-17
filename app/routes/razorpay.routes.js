module.exports = (app) => {
  const controller = require("../controllers/razorpay.controller");

  app.post("/api/create-razorpay-order", controller.createOrder);
};
