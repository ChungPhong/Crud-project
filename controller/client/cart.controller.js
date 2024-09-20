const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const productsHelper = require("../../helpers/product");

//[GET] /cart/
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;
  const cart = await Cart.findOne({
    _id: cartId,
  });
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;
      const productInfo = await Product.findOne({
        _id: productId,
      });
      productInfo.priceNew = productsHelper.priceNewProduct(productInfo);

      item.productInfo = productInfo;

      item.totalPrice = item.quantity * productInfo.priceNew;
    }
  }
  cart.totalPrice = cart.products.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );
  res.render("client/page/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

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

//[GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const productId = req.params.productId;
  const cartId = req.cookies.cartId;

  console.log(">>>productId: ", productId);
  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );
  req.flash("success", "Xóa thành công");
  res.redirect("back");
};
