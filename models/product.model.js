const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const customer = new mongoose.Schema(
  {
    title: String, //Sản phẩm 1
    description: String,
    price: Number,
    discountPercentage: Number,
    stock: Number,
    status: String,
    thumbnail: String,
    position: Number,
    product_category_id: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      slug: "title", //san-pham-1
      unique: true,
    },
    createdBy: {
      account_id: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    // deletedAt: Date,
    deletedBy: {
      account_id: String,
      deletedAt: Date,
    },
    updatedBy: [
      {
        account_id: String,
        updatedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Product = mongoose.model("Products", customer, "products");

module.exports = Product;
