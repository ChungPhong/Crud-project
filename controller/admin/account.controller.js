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
    record.role = role;
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
    console.log(record);
    await record.save();
    res.redirect("/admin/accounts");
  }
};
