const Product = require("../../models/product.model");
const productsHelper = require("../../helpers/product");
module.exports.index = async (req, res) => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  }).limit(6);

  const newProductsFeatured = productsHelper.priceNewProducts(productsFeatured);

  // Lấy ra sản phẩm mới nhất
  const productsNew = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(4);
  const newProductsNew = productsHelper.priceNewProducts(productsNew);

  res.render("client/page/home/index", {
    pageTitle: "Trang trủ",
    productsFeatured: newProductsFeatured,
    productsNew: newProductsNew,
  });
};
