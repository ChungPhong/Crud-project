const User = require("../../models/user.model");
const Cart = require("../../models/cart.model");
const ForgotPassword = require("../../models/forgot-password.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");
const Chat = require("../../models/chat.model");

//[GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  // SocketIo once là kết nối 1 lần duy nhất
  _io.once("connection", (socket) => {
    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      //Lưu vào database
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      await chat.save();

      //Trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content,
      });
    });
  });
  // end SocketIo

  // Lấy ra data và in ra giao diện
  const chats = await Chat.find({
    deleted: false,
  });
  console.log(">>>>>chats: ", chats);

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");
    chat.infoUser = infoUser;
  }

  res.render("client/page/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
