const Role = require("../../models/role.model");

//[GET]Admin/role
module.exports.index = async (req, res) => {
  const find = {
    deleted: false,
  };

  const records = await Role.find(find);
  console.log(records);
  res.render("admin/page/role/index", {
    pageTitle: "Trang trủ",
    records: records,
  });
};

// [GET]Admin/role/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/page/role/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: records,
  });
};
// [GET]Admin/role/create
module.exports.createPost = async (req, res) => {
  const record = new Role(req.body);

  await record.save();
  res.redirect("/admin/roles");
};

// [GET]Admin/role/edit
module.exports.edit = async (req, res) => {
  const id = req.params.id;
  const records = await Role.findOne({
    deleted: false,
    _id: id,
  });

  res.render("admin/page/role/edit", {
    pageTitle: "Chỉnh sửa danh mục sản phẩm",
    records: records,
  });
};
// [PATCH]Admin/role/edit
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  try {
    await Role.updateOne({ _id: id }, req.body);
    req.flash("success", "Cập nhật sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật sản phẩm thất bại!");
    res.redirect("back");
  }
};
// [GET]Admin/role/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };
  const records = await Role.find(find);
  res.render("admin/page/role/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};
// [PATCH]Admin/role/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const permissions = JSON.parse(req.body.permissions);
    for (const item of permissions) {
      await Role.updateOne({ _id: item.id }, { permissions: item.permissions });
    }
    req.flash("success", "Cập nhật phân quyền thành công!");
    res.redirect("back");
  } catch (error) {
    req.flash("error", "Cập nhật phân quyền thất bại!");
  }
};
