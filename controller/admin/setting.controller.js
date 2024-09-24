const Product = require("../../models/product.model");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelper = require("../../helpers/search");
const paginationHelpers = require("../../helpers/pagination");
const mongoose = require("mongoose");
const createTreeHelper = require("../../helpers/createTrees");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");
const SettingGeneral = require("../../models/settings-general.model");

//[GET]/admin/settings/general
module.exports.general = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.render("admin/page/settings/general", {
    pageTitle: "Cài đặt chung",
    settingGeneral: settingGeneral,
  });
};

//[PATCH]/admin/settings/general
module.exports.generalPatch = async (req, res) => {
  const settingGeneral = await SettingGeneral.findOne({});
  if (settingGeneral) {
    await SettingGeneral.updateOne(
      {
        _id: settingGeneral.id,
      },
      req.body
    );
  } else {
    const record = new SettingGeneral(req.body);
    await record.save();
  }
  req.flash("success", "Cập nhật thành công!");
  res.redirect("back");
};
