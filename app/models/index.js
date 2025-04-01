const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.product = require("./product.model");
db.productDetail = require("./productDetail.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
