const mongoose = require("mongoose");

const customer = new mongoose.Schema(
  {
    cart_id: String,
    userInfo: {
      fullName: String,
      phone: String,
      address: String,
    },
    products: [
      {
        product_id: String,
        quantity: Number,
        price: Number,
        discountPercentage: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Order = mongoose.model("Order", customer, "orders");

module.exports = Order;
