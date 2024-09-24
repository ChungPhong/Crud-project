const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");

//[GET] /chat/
module.exports.index = async (req, res) => {
  // SocketIo
  _io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
  });
  // SocketIo
  res.render("client/page/chat/index", {
    pageTitle: "Chat",
  });
};
