const Account = require("../../models/account.model");
const Role = require("../../models/role.model");
const md5 = require("md5");
//[GET]Admin/auth/login
module.exports.login = async (req, res) => {
  if (req.cookies.token) {
    res.redirect("/admin/dashboard");
  } else {
    res.render("admin/page/auth/login", {
      pageTitle: "Trang đăng nhập",
    });
  }
};
//[POST]Admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const user = await Account.findOne({
    email: email,
    deleted: false,
  });
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    return res.render("admin/page/auth/login", {
      email: email, // Truyền lại giá trị email để giữ lại trên form
    });
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai tài khoản hoặc mật khẩu");
    return res.render("admin/page/auth/login", {
      email: email, // Truyền lại giá trị email để giữ lại trên form
    });
  }
  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect("back");
    return;
  }
  res.cookie("token", user.token);
  res.redirect("/admin/dashboard");
};
//[GET]Admin/auth/logout
module.exports.logout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/admin/auth/login");
};
