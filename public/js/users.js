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

  // badgeUsersAccept.classList.add("active");

  if (userId == data.userId) {
    badgeUsersAccept.innerHTML = data.lengthAcceptFriends;
  }
});
// END SERVER_RETURN_LENGTH_ACCPET_FRIEND

//SERVER_RETURN_INFO_ACCPET_FRIEND
socket.on("SERVER_RETURN_INFO_ACCPET_FRIEND", (data) => {
  // Trang lời mời kết bạn
  const dataUserAccept = document.querySelector("[data-user-accept]");
  if (dataUserAccept) {
    const userId = dataUserAccept.getAttribute("data-user-accept");
    if (userId == data.userId) {
      //Vẽ user ra giao diện
      const newBoxUser = document.createElement("div");
      newBoxUser.classList.add("col-6");
      newBoxUser.setAttribute("user-id", data.infoUserA._id);
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

      //Chấp nhận lời mới kết bạn
      const btnAcceptFriend = newBoxUser.querySelector("[btn-accept-friend]");
      btnAcceptFriend.addEventListener("click", () => {
        btnAcceptFriend.closest(".box-user").classList.add("accepted");

        const userId = btnAcceptFriend.getAttribute("btn-accept-friend");
        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
      });
      //Chấp nhận lời mới kết bạn
    }
  }
  // HẾT TRANG LỜI MỜI KẾT BẠN
  //Trang danh sách người dùng
  const dataUserNotFriend = document.querySelector("[data-users-not-friend]");
  if (dataUserNotFriend) {
    const userId = dataUserNotFriend.getAttribute("data-users-not-friend");
    if (userId == data.userId) {
      //Xóa A khỏi danh sách của B
      const boxUserRemove = dataUserNotFriend.querySelector(
        `[user-id="${data.infoUserA._id}"]`
      );
      if (boxUserRemove) {
        dataUserNotFriend.removeChild(boxUserRemove);
      }
    }
  }

  //Hết trang danh sách người dùng
});
//END SERVER_RETURN_INFO_ACCPET_FRIEND

// SERVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
  const dataUserAccept = document.querySelector("[data-user-accept]");
  const userId = dataUserAccept.getAttribute("data-user-accept");
  if (userId == data.userId) {
    //Xóa A khỏi danh sách của B
    const boxUserRemove = dataUserAccept.querySelector(
      `[user-id="${data.userIdA}"]`
    );
    if (boxUserRemove) {
      dataUserAccept.removeChild(boxUserRemove);
    }
  }
});
// END SERVER_RETURN_USER_ID_CANCEL_FRIEND

//SERVER_RETURN_USER_ONLINE
socket.on("SERVER_RETURN_USER_ONLINE", (userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if (boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", "online");
    }
  }
});
//END SERVER_RETURN_USER_ONLINE

//SERVER_RETURN_USER_OFLINE
socket.on("SERVER_RETURN_USER_OFLINE", (userId) => {
  const dataUsersFriend = document.querySelector("[data-users-friend]");
  if (dataUsersFriend) {
    const boxUser = dataUsersFriend.querySelector(`[user-id="${userId}"]`);
    if (boxUser) {
      boxUser.querySelector("[status]").setAttribute("status", "offline");
    }
  }
});
//END SERVER_RETURN_USER_OFLINE 
