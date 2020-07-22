const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
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

const isAuthor = (authorized) => {
  // display edits when user is authorized
  const writeArticle = document.querySelector(".write-article");
  const unauthorized = document.querySelector(".unauthorized-author");

  if (authorized) {
    writeArticle.classList.remove("hide");
    unauthorized.classList.add("hide");
  } else {
    writeArticle.classList.add("hide");
    unauthorized.classList.remove("hide");
  }

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
    a.setAttribute("href", "./signin.html");
    a.textContent = "Sign In";
    signInOut.appendChild(a);
  }
};

window.addEventListener("load", () => {
  // check for signed in user
  const isSignedIn = localStorage.getItem("signedIn");

  responsive();
  isAuthor(isSignedIn === "true" ? true : false);
});
