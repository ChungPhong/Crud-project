const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const productsHelper = require("../../helpers/product");

//[POST] /cart/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = +req.body.quantity;

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const existProductIncart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductIncart) {
    //Cập nhật quantity
    const newQuantity = quantity + existProductIncart.quantity;
    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuantity,
      }
    );
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
    res.redirect("back");
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };
    await Cart.updateOne(
      {
        _id: cartId,
      },
      {
        $push: { products: objectCart },
      }
    );
    req.flash("success", "Thêm sản phẩm vào giỏ hàng thành công");
    res.redirect("back");
  }
};
