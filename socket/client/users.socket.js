const Chat = require("../../models/chat.model");
const User = require("../../models/user.model");

module.exports = async (res) => {
  _io.once("connection", (socket) => {
    // Người dùng gửi yêu cầu kết bạn
    socket.on("CLIENT_ADD_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //   console.log(">>>myUserId: ", myUserId); //Id của A
      //   console.log(">>>userId: ", userId); //Id của B

      //Thêm id của A vào acceptFriends của B
      const exitsUserAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });
      if (!exitsUserAInB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $push: { acceptFriends: myUserId },
          }
        );
      }
      //Thêm id của B vào requestFriends của A
      const exitsUserBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (!exitsUserBInA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $push: { requestFriends: userId },
          }
        );
      }
    });
    // Người dùng hủy gửi yêu cầu kết bạn

    socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {
      const myUserId = res.locals.user.id;

      //   console.log(">>>myUserId: ", myUserId); //Id của A
      //   console.log(">>>userId: ", userId); //Id của B

      //Xóa id của A vào acceptFriends của B
      const exitsUserAInB = await User.findOne({
        _id: userId,
        acceptFriends: myUserId,
      });

      if (exitsUserAInB) {
        await User.updateOne(
          {
            _id: userId,
          },
          {
            $pull: { acceptFriends: myUserId },
          }
        );
      }
      //Xóa id của B vào requestFriends của A
      const exitsUserBInA = await User.findOne({
        _id: myUserId,
        requestFriends: userId,
      });
      if (exitsUserBInA) {
        await User.updateOne(
          {
            _id: myUserId,
          },
          {
            $pull: { requestFriends: userId },
          }
        );
      }
    });
  });
};
