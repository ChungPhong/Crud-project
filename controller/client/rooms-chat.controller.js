const Product = require("../../models/product.model");
const Cart = require("../../models/cart.model");
const productsHelper = require("../../helpers/product");

//[GET] /rooms-chat/
module.exports.index = async (req, res) => {
  res.render("client/page/rooms-chat/index", {
    pageTitle: "Danh sách phòng",
  });
};
