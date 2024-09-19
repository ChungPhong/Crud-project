const mongoose = require("mongoose");

const customer = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: String,
        quantity: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Cart = mongoose.model("Cart", customer, "carts");

module.exports = Cart;
