const ProductCategory = require("../../models/product-category.model");
const createTreeHelper = require("../../helpers/createTrees");
//[GET]Admin/product-category
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);

  res.render("admin/page/product-category/index.pug", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
  });
};

//[GET]Admin/product-category/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await ProductCategory.find(find);
  const newRecords = createTreeHelper.tree(records);

  res.render("admin/page/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  });
};

//[POST]Admin/product-categorry/create
module.exports.createPost = async (req, res) => {
  //Gợi ý nếu ngta dùng postman xóa
  // const permissions = res.locals.role.permissions;
  // console.log(res.locals.role.permissions);
  // if (permissions.includes("products-category_create")) {
  //   console.log("có quyền");
  // } else {
  //   res.send("403")
  //   return;
  // }

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
//[GET]Admin/product-categorry/edit:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      deleted: false,
      _id: id,
    });

    const records = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(records);

    res.render("admin/page/product-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect("/admin/products-category");
  }
};

//[PATCH]Admin/product-categorry/edit:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.position = +req.body.position;

  try {
    await ProductCategory.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
    res.redirect("back");
  }
};

//[PATCH]Admin/product-categorry/detail:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const records = await ProductCategory.findOne(find);
    res.render("admin/page/product-category/detail", {
      pageTitle: "Thông tin sản phẩm sản phẩm",
      records: records,
    });
  } catch (error) {
    res.redirect("/admin/products-category/");
  }
};

//[DELETE]Admin/product/delete:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); Xóa cứng
  await ProductCategory.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );

  res.redirect("back");
};
