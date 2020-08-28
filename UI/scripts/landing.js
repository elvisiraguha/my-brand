import {
  displayNotification,
} from "./helperFunctions.js";

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.reload();
};

const handleLogin = () => {
  window.location.assign("./UI/pages/signin.html");
};

const token = localStorage.getItem('token');

const isAuthor = () => {
  const adminLink = document.querySelector(".admin-link");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");

  if (token) {
    signInOutBtn.textContent = "SignOut";
    signInOutBtn.addEventListener("click", handleLogout);
    adminLink.classList.remove("hide");
  } else {
    signInOutBtn.textContent = "SignIn";
    signInOutBtn.addEventListener("click", handleLogin);
    adminLink.classList.add("hide");
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

const highlightNav = () => {
  // highlighting the current nav
  const inPageLinks = document.querySelectorAll(".inpage-links");

  const experience = document.querySelector("#experience-section");
  const experienceOffsetTop = experience.offsetTop;
  const experienceHeight = experience.scrollHeight;

  const projects = document.querySelector("#projects-section");
  const projectsOffsetTop = projects.offsetTop;
  const projectsHeight = projects.scrollHeight;

  const contacts = document.querySelector("#contacts-section");
  const contactsOffsetTop = contacts.offsetTop;
  const contactsHeight = contacts.scrollHeight;

  const changeActiveLink = (selector) => {
    inPageLinks.forEach((inPagelink) =>
      inPagelink.classList.remove("active-nav")
    );
    if (selector) {
      const link = document.querySelector(selector);
      link.classList.add("active-nav");
    }
  };

  document.addEventListener("scroll", ({ target }) => {
    const scrollTop = window.pageYOffset;

    if (
      scrollTop > experienceOffsetTop &&
      scrollTop < experienceOffsetTop + experienceHeight
    ) {
      changeActiveLink(".link-to-experience");
    } else if (
      scrollTop > projectsOffsetTop &&
      scrollTop < projectsOffsetTop + projectsHeight
    ) {
      changeActiveLink(".link-to-projects");
    } else if (
      scrollTop > contactsOffsetTop &&
      scrollTop < contactsOffsetTop + contactsHeight
    ) {
      changeActiveLink(".link-to-contacts");
    } else {
      changeActiveLink(null);
    }
  });
};

const messageForm = document.querySelector("#leave-message-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const subjectInput = document.querySelector("#subject-input");
const messageInput = document.querySelector("#message-input");
const errorMessage = document.querySelector(".error-message");

const validate = () => {
  const emailRex = /\S+@\S+\.\S+/;

  if (nameInput.value.length < 4) {
    errorMessage.textContent = "The name must be at least 4 charcters long";
    return false;
  } else if (!emailRex.test(emailInput.value)) {
    errorMessage.textContent = "The email is not a valid email address";
    return false;
  } else if (subjectInput.value.length < 4) {
    errorMessage.textContent = "The subject must be at least 4 charcters long";
    return false;
  } else if (messageInput.value.length < 10) {
    errorMessage.textContent = "The message must be at least 10 charcters long";
    return false;
  } else {
    displayNotification("Message is sent successfully!", "success");
    return true;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validate()) {
    errorMessage.classList.add("hide");
    nameInput.value = "";
    emailInput.value = "";
    subjectInput.value = "";
    messageInput.value = "";
  } else {
    errorMessage.classList.remove("hide");
  }
};

messageForm.addEventListener("submit", handleSubmit);

isAuthor();
responsive();

window.addEventListener("load", () => {
  highlightNav();
});
