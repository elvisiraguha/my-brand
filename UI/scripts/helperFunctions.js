const main = document.querySelector("main");
const contaner = document.querySelector(".container");

// notification
const notification = document.createElement("div");
notification.setAttribute("id", "notification");
notification.classList.add("hide");

export const displayNotification = (message, status) => {
  notification.setAttribute("class", `notification-${status}`);
  notification.textContent = message;
  main.appendChild(notification);
  notification.classList.remove("hide");

  setTimeout(() => {
    notification.classList.add("hide");
  }, 3000);
};

// loader
const loader = document.createElement("div");
loader.innerHTML = `
<div class="loader"></div>
`;
loader.classList.add("loader-modal");

export const showLoader = () => {
  contaner.appendChild(loader);
};

export const hideLoader = () => {
  contaner.removeChild(loader);
};
