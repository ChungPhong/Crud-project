//Show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = +showAlert.getAttribute("data-time");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
//Show-alert

//button-go-back
const buttonGoback = document.querySelectorAll("[button-go-back]");
if (buttonGoback.length > 0) {
  buttonGoback.forEach((button) => {
    button.addEventListener("click", (e) => {
      history.back();
    });
  });
}
//END button-go-back
