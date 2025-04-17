const razorpay = require("../../razorpay.config");

exports.createOrder = async (req, res) => {
  try {
    let { amount } = req.body;

    if (amount > 50000000) {
      return res.status(400).json({
        message: "Amount exceeds Razorpay maximum limit (₹5,00,000).",
      });
    }

    const options = {
      amount: amount,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    res.status(500).json({ message: "Unable to create Razorpay order" });
  }
};
