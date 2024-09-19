//Show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = +showAlert.getAttribute("data-time");
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);
}
