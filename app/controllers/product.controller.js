const mongoose = require("mongoose");
const Product = require("../models/product.model");
const ProductDetail = require("../models/productDetail.model");


// exports.addProduct = async (req, res) => {
//   try {
//     // Create Product
//     const product = await Product.create({
//       name: req.body.name,
//       price: req.body.price,
//       qty: req.body.qty,
//       is_deleted: false,
//     });

//     console.log("✅ New product added:", product);

//     // Create ProductDetail with multiple colors and sizes
//     const productDetail = await ProductDetail.create({
//       product_id: product._id,
//       shortdescription: req.body.shortdescription,
//       longdescription: req.body.longdescription,
//       color: req.body.color,  // ✅ Expecting an array of strings
//       size: req.body.size,    // ✅ Expecting an array of strings
//     });

//     console.log("✅ Product detail added:", productDetail);

//     res.status(200).send({ success: true, product, productDetail });

//   } catch (err) {
//     console.error("❌ Error:", err);
//     res.status(500).send({ success: false, message: err.message });
//   }
// };
exports.addProduct = (req, res) => {
    Product.create({
        name: req.body.name,
        price: req.body.price,
        qty: req.body.qty,
        is_deleted: false,
    })
        .then((product) => {
            if (!product) {
                return res.status(404).send({ message: "Product is not created." });
            }
            console.log("New product added: ", product);

            return ProductDetail.create({
                product_id: product._id,
                shortdescription: req.body.shortdescription,
                longdescription: req.body.longdescription,
                color: req.body.color,
                size: req.body.size,
            })
                .then((productDetail) => {
                    if (!productDetail) {
                        return res
                            .status(404)
                            .send({ message: "Product detail is not created." });
                    }
                    console.log("Product detail added: ", productDetail);

                    res.status(200).send({
                        success: true,
                        product: product,
                        productDetail: productDetail,
                    });
                })
                .catch((err) => {
                    console.log("adding product detail error: ", err);
                    res.status(500).send({ success: false, message: err });
                });
        })
        .catch((err) => {
            console.log("adding product error: ", err);
            res.status(500).send({ success: false, message: err });
        });
};

exports.productList = (req, res) => {
    Product.find({ is_deleted: false })
        .then((product) => {
            if (product) {
                res.status(200).send({ success: true, list: product });
                return;
            } else {
                res.status(404).send({ message: "Products not found." });
            }
        })
        .catch((err) => {
            console.log("error in fetching product list: ", err);
            res.status(500).send({ success: false, message: err });
        });
};

exports.getProductById = async (req, res) => {
    const product = await Product.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(req.params.id), is_deleted: false } },
        {
            $lookup: {
                from: 'productdetails',
                localField: '_id',
                foreignField: 'product_id',
                as: 'productDetail'
            }
        }
    ]);
    // console.log("aggregate result:", product);

    if (!product.length) {
        return res.status(404).send({ success: false, message: "Product not found." });
    }
    res.status(200).send({ success: true, product: product });
    return;
};

// exports.getProductById = (req, res) => {
//   Product.findById(req.params.id)
//     .then((product) => {
//       if (!product) {
//         res.status(404).send({ message: "Products not found." });
//         return;
//       }

//       return ProductDetail.find({ product_id: req.params.id })
//         .then((productDetail) => {
//           if (!productDetail) {
//             res.status(404).send({ message: "Product detail not found." });
//             return;
//           }
//           res.status(200).send({ success: true, product, productDetail });
//         })
//         .catch((err) => {
//           res.status(500).send({ success: false, message: err.message });
//         });
//     })
//     .catch((err) => {
//       res.status(500).send({ success: false, message: err.message });
//     });
// };

exports.updateProduct = (req, res) => {
    Product.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((product) => {
            if (!product) {
                res.status(404).send({ message: "Product not found." });
                return;
            }
            console.log("Product updated: ", product);

            return ProductDetail.findOneAndUpdate(
                { product_id: new mongoose.Types.ObjectId(req.params.id) },
                req.body,
                { new: true }
            )
                .then((productDetail) => {
                    if (!productDetail) {
                        res.status(404).send({ message: "Product detail not found." });
                        return;
                    }
                    console.log("Product detail updated: ", productDetail);
                    res.status(200).send({ success: true, product, productDetail });
                    return;
                })
                .catch((err) => {
                    res.status(500).send({ success: false, message: err.message });
                });
        })
        .catch((err) => {
            res.status(500).send({ success: false, message: err.message });
        });
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
