const mongoose = require("mongoose");

const Order = mongoose.model(
  "Order",
  new mongoose.Schema({
    products: [
      {
        productId: { type: String },
        qty: { type: Number },
        totalPrice: { type: Number },
      },
    ],
    totalAmount: { type: Number },
  })
);

module.exports = Order;
