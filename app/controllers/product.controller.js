const mongoose = require("mongoose");
const Product = require("../models/product.model");
const ProductDetail = require("../models/productDetail.model");
const Order = require("../models/Order");

exports.addProduct = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => `uploads/${file.filename}`);

    const product = await Product.create({
      name: req.body.name,
      price: req.body.price,
      qty: req.body.qty,
      img: req.body.img,
      images: imagePaths,
      is_deleted: false,
    });

    console.log("New product added:", product);

    const productDetail = await ProductDetail.create({
      product_id: product._id,
      shortdescription: req.body.shortdescription,
      longdescription: req.body.longdescription,
      color: JSON.parse(req.body.color),
      size: JSON.parse(req.body.size),
    });

    console.log("Product detail added:", productDetail);

    res.status(200).send({ success: true, product, productDetail });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

exports.productList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;
    const total = await Product.countDocuments({ is_deleted: false });

    const products = await Product.find({ is_deleted: false })
      .skip(skip)
      .limit(limit);

    res.status(200).send({
      success: true,
      list: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.log("Error in fetching paginated product list: ", err);
    res.status(500).send({ success: false, message: err.message });
  }
};

exports.getProductById = async (req, res) => {
  const product = await Product.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.params.id),
        is_deleted: false,
      },
    },
    {
      $lookup: {
        from: "productdetails",
        localField: "_id",
        foreignField: "product_id",
        as: "productDetail",
      },
    },
  ]);
  // console.log("aggregate result:", product);

  if (!product.length) {
    return res
      .status(404)
      .send({ success: false, message: "Product not found." });
  }
  res.status(200).send({ success: true, product: product[0] });
  return;
};

exports.updateProduct = async (req, res) => {
  try {
    const newImages =
      req.files?.map((file) => `uploads/${file.filename}`) || [];

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty,
        img: req.body.img,
        ...(newImages.length > 0 && { images: newImages }), // only overwrite if new images uploaded
      },
      { new: true }
    );

    const updatedProductDetail = await ProductDetail.findOneAndUpdate(
      { product_id: req.params.id },
      {
        shortdescription: req.body.shortdescription,
        longdescription: req.body.longdescription,
        color: JSON.parse(req.body.color),
        size: JSON.parse(req.body.size),
      },
      { new: true, upsert: true }
    );

    res.status(200).send({
      success: true,
      product: updatedProduct,
      productDetail: updatedProductDetail,
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};

exports.deleteProduct = (req, res) => {
  Product.findByIdAndUpdate(req.params.id, { is_deleted: true }, { new: true })
    .then((product) => {
      if (!product) {
        res.status(404).send({ message: "Product not found." });
        return;
      }
      console.log("Product deleted: ", product);
      res.status(200).send({ success: true, product });
      return;
    })
    .catch((err) => {
      res.status(500).send({ success: false, message: err.message });
    });
};

exports.placeOrder = async (req, res) => {
  try {
    console.log("Incoming Order:", req.body);
    const { products, totalAmount, paymentInfo } = req.body;

    if (!products || !products.length || !totalAmount || !paymentInfo) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newOrder = new Order({ products, totalAmount, paymentInfo });
    await newOrder.save();

    console.log("New order created:", newOrder);
    res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Failed to create order" });
  }
};
