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

responsive();
isAuthor(isSignedIn === "true" ? true : false);
