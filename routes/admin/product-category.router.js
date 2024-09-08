const express = require("express");
const router = express.Router();
const multer = require("multer");

const upload = multer();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate = require("../../validates/admin/product-category.validate");

const productCategory = require("../../controller/admin/product-category.controller");

router.get("/", productCategory.index);
router.get("/create", productCategory.create);

router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productCategory.createPost
);
module.exports = router;
