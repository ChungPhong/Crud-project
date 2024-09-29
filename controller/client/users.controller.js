const User = require("../../models/user.model");
const usersSocket = require("../../socket/client/users.socket");
//[GET] /users/not-friend
module.exports.notFriend = async (req, res) => {
  // Socket
  usersSocket(res);

  // END Socket
  const userId = res.locals.user.id;
  const myUser = await User.findOne({
    _id: userId,
  });
  const requestFriends = myUser.requestFriends;
  const acceptFriends = myUser.acceptFriends;

  const users = await User.find({
    $and: [
      { _id: { $ne: userId } }, //$ne: Không bằng, nó sẽ trả ra tất cả các id ngoại trừ id ta
      { _id: { $nin: requestFriends } },
      { _id: { $nin: acceptFriends } },
    ],
    status: "active",
    deleted: false,
  }).select("avatar fullName");

  res.render("client/page/users/not-friend", {
    pageTitle: "Danh sách người dùng",
    users: users,
  });
};
