const main = document.querySelector("main");
const container = document.querySelector(".container");

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
  container.appendChild(loader);
};

export const hideLoader = () => {
  if (loader === container.lastElementChild) {
    container.removeChild(loader);
  }
};

const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

responsive();

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.pageYOffset > header.offsetTop) {
    header.classList.add("underline");
  } else {
    header.classList.remove("underline");
  }
});
