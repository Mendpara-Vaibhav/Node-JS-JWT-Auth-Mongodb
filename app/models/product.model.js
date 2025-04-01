const mongoose = require("mongoose");

const Product = mongoose.model(
  "Product",
  new mongoose.Schema({
    name: String,
    price: Number,
    qty: Number,
    is_deleted: Boolean,
  })
);

module.exports = Product;
