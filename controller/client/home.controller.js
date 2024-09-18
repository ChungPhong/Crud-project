const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(4);

  const newProducts = productsHelper.priceNewProducts(productsFeatured);

  res.render("client/page/home/index", {
    pageTitle: "Trang trủ",
    productsFeatured: newProducts,
  });
};
