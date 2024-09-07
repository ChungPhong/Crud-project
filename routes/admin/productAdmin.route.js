const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const router = express.Router();
// const storageMulter = require("../../helpers/storageMulter");
// const upload = multer({ storage: storageMulter() });

const upload = multer();

const productAdmin = require("../../controller/admin/productAdmin.controller");
const validate = require("../../validates/admin/product.validate");

router.get("/", productAdmin.index);
router.patch("/change-status/:status/:id", productAdmin.changeStatus);
router.patch("/change-multi/", productAdmin.changeMulti);
router.delete("/delete/:id/", productAdmin.deleteItem);
router.get("/create", productAdmin.create);
router.post(
  "/create",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productAdmin.createPost
);
router.get("/edit/:id", productAdmin.edit);
router.patch(
  "/edit/:id",
  upload.single("thumbnail"),
  uploadCloud.upload,
  validate.createPost,
  productAdmin.editPatch
);

router.get("/detail/:id", productAdmin.detail);
module.exports = router;
