import { showLoader, hideLoader } from "./helperFunctions.js";

const form = document.querySelector(".signin-container form");
const email = document.querySelector("form .email-input");
const password = document.querySelector("form .password-input");
const errorMessage = document.querySelector(".error-message");

const validate = () => {
  var passwordRex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
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

const handleData = (response) => {
  if (response.status === 200) {
    localStorage.setItem("token", response.data.token);
    window.location.assign("./admin.html");
  } else {
    password.value = "";
    errorMessage.classList.remove("hide");
    errorMessage.textContent = response.message;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  const url = "https://my-brand-yo2d.onrender.com//api/auth/signin";

  if (validate()) {
    showLoader();
    errorMessage.textContent = "";

    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    };

    fetch(url, fetchOptions)
      .then((res) => {
        hideLoader();
        return res.json();
      })
      .then((data) => {
        handleData(data);
      })
      .catch((err) => {
        hideLoader();
        password.value = "";
        errorMessage.classList.remove("hide");
        errorMessage.textContent = err;
      });
  } else {
    errorMessage.classList.remove("hide");
  }
};

form.addEventListener("submit", handleSubmit);
