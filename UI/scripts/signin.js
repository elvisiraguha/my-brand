const form = document.querySelector(".signin-container form");
const email = document.querySelector("form .email-input");
const password = document.querySelector("form .password-input");

const handleSubmit = (e) => {
  e.preventDefault();
  localStorage.setItem("signedIn", true);
  window.location.replace("blogs.html");
};

form.addEventListener("submit", handleSubmit);

const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

window.addEventListener("load", () => {
  responsive();
});
