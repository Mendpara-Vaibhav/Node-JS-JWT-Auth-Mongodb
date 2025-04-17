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
    paymentInfo: {
      id: String, // Razorpay Payment ID
      order_id: String, // Razorpay Order ID
      signature: String, // Razorpay Signature
      amount: Number, // in rupees
      currency: String,
      status: String,
      receipt: String,
      paidAt: Date,
    },
  })
);

module.exports = Order;
