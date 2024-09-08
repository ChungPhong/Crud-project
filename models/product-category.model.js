const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const customer = new mongoose.Schema(
  {
    title: String, //Sản phẩm 1
    parent_id: {
      type: String,
      default: "",
    },
    description: String,
    status: String,
    thumbnail: String,
    position: Number,
    slug: {
      type: String,
      slug: "title", //san-pham-1
      unique: true,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
  }
);
const ProductCategory = mongoose.model(
  "ProductCategory",
  customer,
  "products-category"
);

module.exports = ProductCategory;
