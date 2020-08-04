export const displayNotification = (message, status) => {
  const notification = document.querySelector(".notification");
  notification.textContent = message;
  notification.classList.add(`notification-${status}`);
  notification.classList.remove("hide");
  notification.classList.remove("hide");

  setTimeout(() => {
    notification.classList.add("hide");
  }, 3000);
};
