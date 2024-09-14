const express = require("express");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const router = express.Router();

const upload = multer();

const controller = require("../../controller/admin/account.controller");
const validate = require("../../validates/admin/account.validate");

router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single("avatar"),
  uploadCloud.upload,
  validate.createPost,
  controller.createPost
);

module.exports = router;
