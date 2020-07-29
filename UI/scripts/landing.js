const isSignedIn = localStorage.getItem("signedIn");

const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
};

const isAuthor = (authorized) => {
  const signInOut = document.querySelector(".sign-in-out-link");
  const adminLink = document.querySelector(".admin-link");

  if (authorized) {
    const button = document.createElement("button");
    button.setAttribute("class", "signout-btn");
    button.textContent = "Signout";
    button.addEventListener("click", handleLogout);
    signInOut.appendChild(button);
    adminLink.classList.remove("hide");
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./UI/pages/signin.html");
    a.textContent = "Signin";
    signInOut.appendChild(a);
    adminLink.classList.add("hide");
  }
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

const checkContents = () => {
  if (
    nameInput.value.length >= 4 &&
    emailInput.value.length >= 6 &&
    subjectInput.value.length >= 4 &&
    messageInput.value.length >= 10
  ) {
    return true;
  } else {
    return false;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (checkContents()) {
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

responsive();
isAuthor(isSignedIn === "true" ? true : false);

window.addEventListener("load", () => {
  highlightNav();
});
