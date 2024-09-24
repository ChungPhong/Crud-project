const mongoose = require("mongoose");

const customer = new mongoose.Schema(
  {
   websiteName: String,
   logo: String,
   phone: String,
   email:String,
   address:String,
   copyright:String,
  },
  {
    timestamps: true,
  }
);
const SettingGeneral = mongoose.model(
  "SettingGeneral",
  customer,
  "settings-general"
);

module.exports = SettingGeneral;
