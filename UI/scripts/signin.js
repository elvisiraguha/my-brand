const form = document.querySelector(".signin-container form");
const email = document.querySelector("form .email-input");
const password = document.querySelector("form .password-input");
const errorMessage = document.querySelector(".error-message");

const validate = () => {
  const passwordRex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  const emailRex = /\S+@\S+\.\S+/;

  if (!emailRex.test(email.value)) {
    errorMessage.textContent = "The email is not a valid email address";
    return false;
  } else if (!passwordRex.test(password.value)) {
    errorMessage.textContent =
      "Password must be atleast 8 characters long, contain atleast 1 uppercase letter, and atleast 1 digit";
    return false;
  } else {
    return true;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validate()) {
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
