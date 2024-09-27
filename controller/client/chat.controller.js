const User = require("../../models/user.model");
const chatSocket = require("../../socket/client/chat.socket");
const Chat = require("../../models/chat.model");

//[GET] /chat/
module.exports.index = async (req, res) => {
  // SocketIo once là kết nối 1 lần duy nhất
  chatSocket(res);
  // end SocketIo

  // Lấy ra data và in ra giao diện
  const chats = await Chat.find({
    deleted: false,
  });

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
