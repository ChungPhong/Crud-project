import * as Popper from "https://cdn.jsdelivr.net/npm/@popperjs/core@^2/dist/esm/index.js";

//UPLOAD-FILE-IMAGE-PREVIEW

const upload = new FileUploadWithPreview.FileUploadWithPreview("upload-image", {
  multiple: true,
  maxFileCount: 6,
});

//UPLOAD-FILE-IMAGE-PREVIEW

// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (e) => {
    e.preventDefault();
    const content = e.target.elements.content.value;
    const images = upload.cachedFileArray || [];

    if (content || images.length > 0) {
      //Gửi ảnh lên sẽ bị lỗi
      socket.emit("CLIENT_SEND_MESSAGE", {
        content: content,
        images: images,
      });
      e.target.elements.content.value = "";
      upload.resetPreviewPanel();
      socket.emit("CLIENT_SEND_TYPING", "hidden");
    }
  });
}
// CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const body = document.querySelector(".chat .inner-body");
  const boxTyping = document.querySelector(".inner-list-typing");
  const div = document.createElement("div");

  let htmlFullName = "";
  let htmlContent = "";
  let htmlImages = "";
  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = ` <div class="inner-name">${data.fullName}</div>`;
  }
  if (data.content) {
    htmlContent = `
  <div class="inner-content">${data.content}</div>
    `;
  }

  if (data.images) {
    htmlImages += `<div class="inner-images">`;

    for (const image of data.images) {
      htmlImages += `<img src="${image}">`;
    }

    htmlImages += `</div>`;
  }

  div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
  `;

  body.insertBefore(div, boxTyping);
  body.scrollTop = body.scrollHeight;
});
// SERVER_RETURN_MESSAGE

//Scorll
const bodyChat = document.querySelector(".chat .inner-body");
if (bodyChat) {
  bodyChat.scrollTop = bodyChat.scrollHeight;
}
//Scorll

//Show typing
var timeOut;
const showTyping = () => {
  socket.emit("CLIENT_SEND_TYPING", "show");

  clearTimeout(timeOut);

  timeOut = setTimeout(() => {
    socket.emit("CLIENT_SEND_TYPING", "hidden");
  }, 3000);
};
//Show typing

// emoji-click
// Show Popup
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.onclick = () => {
    tooltip.classList.toggle("shown");
  };
}

//Insert Icon To Input
var timeOut;
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  const inputChat = document.querySelector(
    ".chat .inner-form input[name='content']"
  );

  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    inputChat.value = inputChat.value + icon;
    const end = inputChat.value.length;
    inputChat.setSelectionRange(end, end);
    inputChat.focus();
    showTyping();
  });

  inputChat.addEventListener("keyup", () => {
    showTyping();
  });
}
// emoji-click
//  SERVER_RETURN_TYPING
const elementsListTyping = document.querySelector(".chat .inner-list-typing");
if (elementsListTyping) {
  socket.on("SERVER_RETURN_TYPING", (data) => {
    if (data.type == "show") {
      const existTyping = elementsListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      console.log(existTyping);
      if (!existTyping) {
        const bodyChat = document.querySelector(".chat .inner-body");
        const boxTyping = document.createElement("div");
        boxTyping.classList.add("box-typing");
        boxTyping.setAttribute("user-id", data.userId);
        boxTyping.innerHTML = `
        <div class="inner-name">${data.fullName}</div>
        <div class="inner-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
        `;
        elementsListTyping.appendChild(boxTyping);
        bodyChat.scrollTop = bodyChat.scrollHeight;
      }
    } else {
      const boxTypingRemove = elementsListTyping.querySelector(
        `[user-id="${data.userId}"]`
      );
      if (boxTypingRemove) {
        elementsListTyping.removeChild(boxTypingRemove);
      }
    }
  });
}

//  SERVER_RETURN_TYPING
