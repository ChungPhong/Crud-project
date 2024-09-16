const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
//[GET]Admin/accounts
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };
  const records = await Account.find(find).select("-password -token");
  for (const record of records) {
    const role = await Role.findOne({
      deleted: false,
      _id: record.role_id,
    });
    record.role = role.title;
  }

  res.render("admin/page/accounts/index", {
    pageTitle: "Danh sách tài khoản",
    records: records,
  });
};

//[GET]Admin/accounts/create
module.exports.create = async (req, res) => {
  const roles = await Role.find({
    deleted: false,
  });
  res.render("admin/page/accounts/create", {
    pageTitle: "Tạo mới tài khoản",
    roles: roles,
  });
};

//[POST]Admin/accounts/create
module.exports.createPost = async (req, res) => {
  const emailExist = await Account.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect("back");
  } else {
    req.body.password = md5(req.body.password);
    const record = new Account(req.body);
    await record.save();
    res.redirect("/admin/accounts");
  }
};

//[GET]Admin/accounts/edit/:id
module.exports.createEdit = async (req, res) => {
  let find = {
    _id: req.params.id,
    deleted: false,
  };

  try {
    const data = await Account.findOne(find);

    const roles = await Role.find({
      deleted: false,
    });
    res.render("admin/page/accounts/edit", {
      pageTitle: "Chỉnh sửa tài khoản",
      roles: roles,
      data: data,
    });
  } catch (error) {
    res.redirect("/admin/accounts");
  }
};
//[PATCH]Admin/accounts/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExist = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExist) {
    req.flash("error", `Email ${req.body.email} đã tồn tại!`);
    res.redirect("back");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    await Account.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("back");
  }
};
