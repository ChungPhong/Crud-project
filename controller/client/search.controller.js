const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");
const productsHelper = require("../../helpers/product");
const productsCategoryHelper = require("../../helpers/products-category");

//[GET] /search
module.exports.index = async (req, res) => {
  const keyword = req.query.keyword;
  let newProducts = [];
  if (keyword) {
    const keywordRegex = new RegExp(keyword, "i");
    const products = await Product.find({
      title: keywordRegex,
      status: "active",
      deleted: false,
    });
    newProducts = productsHelper.priceNewProducts(products);
  }

  res.render("client/page/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: keyword,
    products: newProducts,
  });
};
