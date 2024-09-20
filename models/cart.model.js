const mongoose = require("mongoose");

const customer = new mongoose.Schema(
  {
    user_id: String, //Tạm thời chưa dùng đến khi nào làm đăng nhập đăng kí thì sử dụng
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
