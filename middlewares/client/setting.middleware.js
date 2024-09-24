const Cart = require("../../models/cart.model");
const User = require("../../models/user.model");
const SettingGeneral = require("../../models/settings-general.model");

module.exports.settingGeneral = async (req, res, next) => {
  const settingGeneral = await SettingGeneral.findOne({});
  res.locals.settingGeneral = settingGeneral;
  next();
};
