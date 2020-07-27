const isSignedIn = localStorage.getItem("signedIn");

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
  const message = document.querySelector(".messages");
  const unauthorized = document.querySelector(".unauthorized-author");

  if (authorized) {
    message.classList.remove("hide");
    unauthorized.classList.add("hide");
  } else {
    message.classList.add("hide");
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

const replyBtns = document.querySelectorAll("button.reply");
const readBtns = document.querySelectorAll("button.read");
const sendBtn = document.querySelector("button.modal-send");
const cancelBtn = document.querySelector("button.modal-cancel");
const replyModal = document.querySelector(".reply-modal");

replyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    toggleModal();
  });
});

readBtns.forEach((btn) => {
  btn.addEventListener("click", ({ target }) => {
    target.classList.toggle("read-on");
    if (target.textContent === "Read") {
      target.innerHTML = "&#10004;";
    } else {
      target.textContent = "Read";
    }
  });
});

sendBtn.addEventListener("click", () => {
  toggleModal();
});

cancelBtn.addEventListener("click", () => {
  toggleModal();
});

const toggleModal = () => {
  replyModal.classList.toggle("hide");
};

responsive();
isAuthor(isSignedIn === "true" ? true : false);
