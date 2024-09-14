const express = require("express");
const router = express.Router();
const authController = require("../../controller/admin/auth.controller");
const validate = require("../../validates/admin/auth.validate");
router.get("/login", authController.login);
router.post("/login", validate.loginPost, authController.loginPost);

module.exports = router;
