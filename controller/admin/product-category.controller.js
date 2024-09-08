const ProductCategory = require("../../models/product-category.model");

//[GET]Admin/product-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);

  res.render("admin/page/product-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: records,
  });
};

//[GET]Admin/product-category/create
module.exports.create = async (req, res) => {
  res.render("admin/page/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
  });
};

//[POST]Admin/product-categorry/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  const record = new ProductCategory(req.body);
  await record.save();

  res.redirect("/admin/products-category");
};
