const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

const handleLogin = () => {
  window.location.assign("./signin.html");
};

const token = localStorage.getItem("token");

const isAuthor = () => {
  const unauthorizedAuthor = document.querySelector(".unauthorized-author");
  const adminContents = document.querySelector(".admin-contents");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");

  if (token) {
    signInOutBtn.textContent = "SignOut";
    signInOutBtn.addEventListener("click", handleLogout);
    unauthorizedAuthor.classList.add("hide");
    adminContents.classList.remove("hide");
  } else {
    signInOutBtn.textContent = "SignIn";
    signInOutBtn.addEventListener("click", handleLogin);
    unauthorizedAuthor.classList.remove("hide");
    adminContents.classList.add("hide");
  }
};

// handle responsiveness
const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

isAuthor();
responsive();
