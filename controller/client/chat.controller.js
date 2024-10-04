const User = require("../../models/user.model");
const chatSocket = require("../../socket/client/chat.socket");
const Chat = require("../../models/chat.model");

//[GET] /chat/:roomChatId
module.exports.index = async (req, res) => {
  const roomChatId = req.params.roomChatId;
  // SocketIo once là kết nối 1 lần duy nhất
  chatSocket(req, res);
  // end SocketIo

  // Lấy ra data và in ra giao diện
  const chats = await Chat.find({
    deleted: false,
    room_chat_id: roomChatId,
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
