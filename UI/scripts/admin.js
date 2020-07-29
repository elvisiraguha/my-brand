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

const isAuthor = (authorized) => {
  const signInOut = document.querySelector(".sign-in-out-link");
  const unauthorizedAuthor = document.querySelector(".unauthorized-author");
  const adminContents = document.querySelector(".admin-contents");

  if (authorized) {
    const button = document.createElement("button");
    button.setAttribute("class", "signout-btn");
    button.textContent = "Signout";
    button.addEventListener("click", handleLogout);
    signInOut.appendChild(button);
    unauthorizedAuthor.classList.add("hide");
    adminContents.classList.remove("hide");
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./signin.html");
    a.textContent = "Signin";
    signInOut.appendChild(a);
    unauthorizedAuthor.classList.remove("hide");
    adminContents.classList.add("hide");
  }
};

responsive();
isAuthor(isSignedIn === "true" ? true : false);
