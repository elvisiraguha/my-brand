const form = document.querySelector(".signin-container form");
const email = document.querySelector("form .email-input");
const password = document.querySelector("form .password-input");
const errorMessage = document.querySelector(".error-message");

const validatePassword = () => {
  if (password.value.length >= 4) {
    return true;
  } else {
    return false;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validatePassword()) {
    localStorage.setItem("signedIn", true);
    window.location.replace("blogs.html");
    errorMessage.classList.add("hide");
  } else {
    errorMessage.classList.remove("hide");
  }
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
