const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
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
  await User.updateOne(
    { _id: user.id },
    {
      statusOnline: "online",
    }
  );

  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
  });

  // Lưu user_id vào collection carts
  await Cart.updateOne(
    {
      _id: req.cookies.cartId,
    },
    {
      user_id: user.id,
    }
  );
  res.redirect("/");
};

//[GET]/user/logout
module.exports.logout = async (req, res) => {
  await User.updateOne(
    { _id: res.locals.user.id },
    {
      statusOnline: "offline",
    }
  );
  _io.once("connection", (socket) => {
    socket.broadcast.emit("SERVER_RETURN_USER_OFLINE", res.locals.user.id);
  });
  res.clearCookie("tokenUser");
  res.redirect("/");
};

//[GET]/user/password/forgot
module.exports.forgotPassword = async (req, res) => {
  res.render("client/page/user/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};

//[POST]/user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({
    email: email,
    deleted: false,
  });
  console.log(email);
  if (!user) {
    req.flash("error", "Email không tồn tại!");
    return res.render("client/page/user/forgot-password", {
      email: email, // Truyền lại giá trị email để giữ lại trên form
    });
  }
  //Nếu có email thì ta có 2 việc phải làm
  //Việc 1: Là tạo mã OTP và lưu thông tin yêu cầu vào collection forgot-password
  const otp = generateHelper.generateRandomNumber(4);
  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: Date.now(),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();
  //Việc 2: Gửi mã OTP qua email của user
  const subject = `Mã OTP xác minh lấy lại mật khẩu`;
  const html = `Mã OTP xác minh lấy lại mật khẩu là
  <b>${otp}</b>. Thời hạn sử dụng là 1 phút. Lưu ý không được chia sẻ mã OTP
  `;

  sendMailHelper.sendMail(email, subject, html);
  res.redirect(`/user/password/otp?email=${email}`);
};

//[GET]/user/password/otp
module.exports.otpPassword = async (req, res) => {
  const email = req.query.email;
  res.render("client/page/user/otp-password", {
    pageTitle: "Nhập mã OTP",
    email: email,
  });
};

//[POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = +req.body.otp;
  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });
  if (!result) {
    req.flash("error", "Mã OTP không hợp lệ!");
    res.redirect("back");
    return;
  }
  const user = await User.findOne({
    email: email,
  });
  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

//[GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/page/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

//[POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const tokenUser = req.cookies.tokenUser;

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  req.flash("success", "Đổi mật khẩu thành công!");
  res.redirect("back");
};

//[GET] /user/info
module.exports.info = async (req, res) => {
  res.render("client/page/user/info", {
    pageTitle: "Thông tin tài khoản",
  });
};
