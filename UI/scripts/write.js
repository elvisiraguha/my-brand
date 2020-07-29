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
    button.textContent = "Signout";
    button.addEventListener("click", handleLogout);
    signInOut.appendChild(button);
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./signin.html");
    a.textContent = "Signin";
    signInOut.appendChild(a);
  }
};

const cancelEditBtn = document.querySelector(".btn-cancel");
const publishBtn = document.querySelector(".btn-publish");
const onLeaveModal = document.querySelector(".leave-modal");
const onPublishModal = document.querySelector(".publish-modal");
const confirmPublish = document.querySelectorAll(".btn-confirm");
const returnToEdit = document.querySelectorAll(".btn-back");

const titleInput = document.querySelector("#title-input");
const imageInput = document.querySelector("#image-input");
const bodyInput = document.querySelector("#body-input");
const errorMessage = document.querySelector(".error-message");

const checkContents = () => {
  if (
    titleInput.value.length >= 10 &&
    bodyInput.value.length >= 20 &&
    imageInput.value
  ) {
    return true;
  } else {
    return false;
  }
};

const handleOnCancelEdit = () => {
  onLeaveModal.classList.remove("hide");
};

const handleOnLeave = (e) => {
  e.preventDefault();
  e.returnValue = "are you sure you want to leave";
};

const handleOnPublish = () => {
  if (checkContents()) {
    errorMessage.classList.add("hide");
    onPublishModal.classList.remove("hide");
  } else {
    errorMessage.classList.remove("hide");
  }
};

const confirmModal = () => {
  titleInput.value = "";
  bodyInput.value = "";
  imageInput.value = "";
  onLeaveModal.classList.add("hide");
  onPublishModal.classList.add("hide");
};

const handleOnReturn = () => {
  onLeaveModal.classList.add("hide");
  onPublishModal.classList.add("hide");
};

cancelEditBtn.addEventListener("click", handleOnCancelEdit);
publishBtn.addEventListener("click", handleOnPublish);

confirmPublish.forEach((btn) => {
  btn.addEventListener("click", confirmModal);
});

returnToEdit.forEach((btn) => {
  btn.addEventListener("click", handleOnReturn);
});

if (isSignedIn === "true") {
  window.addEventListener("beforeunload", handleOnLeave);
}

responsive();
isAuthor(isSignedIn === "true" ? true : false);
