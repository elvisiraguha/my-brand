// check for signed in user
const isSignedIn = localStorage.getItem("signedIn");

// handle responsiveness
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

// display edits and write when user is signed in
const isAuthor = (authorized) => {
  // display either signout or signin nav link if use is singned in
  const signInOut = document.querySelector(".sign-in-out-link");
  if (authorized) {
    const button = document.createElement("button");
    button.setAttribute("class", "signout-btn");
    button.textContent = "Sign Out";
    button.addEventListener("click", handleLogout);
    signInOut.appendChild(button);
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./UI/pages/signin.html");
    a.textContent = "Sign In";
    signInOut.appendChild(a);
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

responsive();
isAuthor(isSignedIn === "true" ? true : false);

window.addEventListener("load", () => {
  highlightNav();
});
