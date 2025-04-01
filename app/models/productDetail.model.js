const mongoose = require("mongoose");

const ProductDetail = mongoose.model(
  "ProductDetail",
  new mongoose.Schema({
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    shortdescription: String,
    longdescription: String,
    color: [{ type: String }],
    size: [{ type: String }],
  })
);

module.exports = ProductDetail;
