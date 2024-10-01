//Chức năng gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
  listBtnAddFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("add");
      const userId = button.getAttribute("btn-add-friend");
      socket.emit("CLIENT_ADD_FRIEND", userId);
    });
  });
}
//END Chức năng gửi yêu cầu

//Chức năng hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
  listBtnCancelFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.remove("add");
      const userId = button.getAttribute("btn-cancel-friend");
      socket.emit("CLIENT_CANCEL_FRIEND", userId);
    });
  });
}
//END Chức năng hủy gửi yêu cầu

//Chức năng từ chối kết bạn
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
  listBtnRefuseFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("refuse");

      const userId = button.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
  });
}
//END Chức năng từ chối kết bạn

//Chức năng chấp nhận kết bạn
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
  listBtnAcceptFriend.forEach((button) => {
    button.addEventListener("click", () => {
      button.closest(".box-user").classList.add("accepted");

      const userId = button.getAttribute("btn-accept-friend");
      socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
  });
}
//END Chức năng chấp nhận  kết bạn

// SERVER_RETURN_LENGTH_ACCPET_FRIEND
socket.on("SERVER_RETURN_LENGTH_ACCPET_FRIEND", (data) => {
  const badgeUsersAccept = document.querySelector("[badge-users-accept]");
  const userId = badgeUsersAccept.getAttribute("badge-users-accept");

  if (userId == data.userId) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// END SERVER_RETURN_LENGTH_ACCPET_FRIEND

//SERVER_RETURN_INFO_ACCPET_FRIEND
socket.on("SERVER_RETURN_INFO_ACCPET_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-user-accept]");
  const userId = dataUserAccept.getAttribute("data-user-accept");

  if (userId == data.userId) {
    //Vẽ user ra giao diện
    const newBoxUser = document.createElement("div");
    newBoxUser.classList.add("col-6");
    newBoxUser.innerHTML = `
    <div class="box-user">
        <div class="inner-avatar">
            <img src="/image/avatar.png" alt="Avatar">
        </div>
        <div class="inner-info">
            <div class="inner-name">${data.infoUserA.fullName}</div>
            <div class="inner-buttons">
                <button class="btn btn-sm btn-primary mr-1" btn-accept-friend=${data.infoUserA._id}>
                    Chấp nhận
                </button>
                <button class="btn btn-sm btn-secondary mr-1" btn-refuse-friend=${data.infoUserA._id}>
                    Xóa
                </button>
                <button class="btn btn-sm btn-secondary mr-1" btn-deleted-friend="" disabled="">
                    Đã xóa
                </button>
                <button class="btn btn-sm btn-secondary mr-1" btn-accepted-friend="" disabled="">
                    Đã chấp nhận
                </button>
            </div>
        </div>
    </div>
    `;
    dataUserAccept.appendChild(newBoxUser);

    //Xóa lời mời kết bạn
    const btnRefuseFriend = newBoxUser.querySelector("[btn-refuse-friend]");
    btnRefuseFriend.addEventListener("click", () => {
      btnRefuseFriend.closest(".box-user").classList.add("refuse");

      const userId = btnRefuseFriend.getAttribute("btn-refuse-friend");
      socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
    //Xóa lời mời kết bạn
  }
});
//END SERVER_RETURN_INFO_ACCPET_FRIEND
