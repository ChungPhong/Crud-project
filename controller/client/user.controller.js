const User = require("../../models/user.model");
const md5 = require("md5");
//[GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/page/user/register", {
    pageTitle: "Đăng kí tài khoản",
  });
};

//[POST] /user/register
module.exports.registerPost = async (req, res) => {
  const exitEmail = await User.findOne({
    email: req.body.email,
    deleted: false,
  });
  if (exitEmail) {
    req.flash("error", "Email đã tồn tại!");
    res.redirect("back");
    return;
  }
  req.body.password = md5(req.body.password);
  const user = new User(req.body);
  await user.save();
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

//[GET]/user/login
module.exports.login = async (req, res) => {
  res.render("client/page/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

//[POST]/user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại!");
    return res.render("client/page/user/login", {
      email: email, // Truyền lại giá trị email để giữ lại trên form
    });
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    return res.render("client/page/user/login", {
      email: email, // Truyền lại giá trị email để giữ lại trên form
    });
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

//[GET]/user/logout
module.exports.logout = async (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/");
};
