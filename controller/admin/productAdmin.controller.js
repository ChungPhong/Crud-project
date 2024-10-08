const Product = require("../../models/product.model");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const mongoose = require("mongoose");
const createTreeHelper = require("../../helpers/createTrees");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

//[GET]Admin/product
module.exports.index = async (req, res) => {
  //đoạn bộ lọc
  const filterStatus = filterStatusHelpers(req.query);

  const find = {
    deleted: false,
  };
  if (req.query.status) {
    find.status = req.query.status;
  }

  //search
  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //pagination
  const countProduct = await Product.countDocuments(find);
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitPage: 4,
    },
    req.query,
    countProduct
  );
  //Sort
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  const products = await Product.find(find)
    .sort(sort)
    .limit(objectPagination.limitPage)
    .skip(objectPagination.skip);

  for (const product of products) {
    // Lấy ra thông tin người tạo
    const user = await Account.findOne({
      _id: product.createdBy.account_id,
    });

    if (user) {
      product.accountFullName = user.fullName;
    }

    // Lấy ra thông tin người cập nhật gần nhất
    const updateBy = product.updatedBy[product.updatedBy.length - 1];
    if (updateBy) {
      const userUpdated = await Account.findOne({
        _id: updateBy.account_id,
      });
      product.accountFullName = userUpdated.fullName;
    }
  }

  res.render("admin/page/productAdmin/index", {
    pageTitle: "Trang sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

//[PATCH]Admin/product/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };

  await Product.updateOne(
    { _id: id },
    {
      status: status,
      $push: { updatedBy: updatedBy },
    }
  );
  req.flash("success", "Bạn đã thay đổi trạng thái thành công!");
  res.redirect("back");
};

//[PATCH]Admin/product/change-mutil
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date(),
  };
  switch (type) {
    case "active":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "active",
          $push: { updatedBy: updatedBy },
        }
      );
      req.flash(
        "success",
        `Cập nhật trạng thái thành công ${ids.length} sản phẩm`
      );
      break;
    case "inactive":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          status: "inactive",
          $push: { updatedBy: updatedBy },
        }
      );
      `Cập nhật trạng thái thành công ${ids.length} sản phẩm`;
      break;
    case "delete-all":
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Xóa thành công ${ids.length} sản phẩm`);
      break;
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);

        await Product.updateOne(
          { _id: id },
          {
            position: position,
            $push: { updatedBy: updatedBy },
          }
        );
      }
      req.flash("success", `Thay đổi vị trí thành công ${ids.length} sản phẩm`);

      break;
    default:
      break;
  }
  res.redirect("back");
};

//[DELETE]Admin/product/delete:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id }); Xóa cứng
  await Product.updateOne(
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

//[GET]Admin/product/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const category = await ProductCategory.find(find);

  const newRecords = createTreeHelper.tree(category);

  res.render("admin/page/productAdmin/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newRecords,
  });
};

//[POST]Admin/product/create
module.exports.createPost = async (req, res) => {
  req.body.price = +req.body.price;
  req.body.stock = +req.body.stock;
  req.body.discountPercentage = +req.body.discountPercentage;

  if (req.body.position == "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = +req.body.position;
  }
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  const product = new Product(req.body);
  await product.save();
  res.redirect("/admin/products");
};

//[GET]Admin/product/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    const category = await ProductCategory.find({
      deleted: false,
    });
    const newRecords = createTreeHelper.tree(category);
    res.render("admin/page/productAdmin/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newRecords,
    });
  } catch (error) {
    res.redirect("/admin/products/");
  }
};

//[PATCH] Admin/product/edit
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = +req.body.price;
  req.body.stock = +req.body.stock;
  req.body.discountPercentage = +req.body.discountPercentage;
  req.body.position = +req.body.position;

  try {
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date(),
    };

    await Product.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("/admin/products");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
  }
};

//[GET]Admin/product/detail:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id,
    };
    const product = await Product.findOne(find);
    res.render("admin/page/productAdmin/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect("/admin/products/");
  }
};
