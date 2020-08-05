import { db, storageRef } from "./firebase.config.js";
import { displayNotification } from "./helperFunctions.js";

const isSignedIn = localStorage.getItem("signedIn");

const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
  displayNotification("Signed out successfully");
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
  const adminLink = document.querySelector(".admin-link");

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
    adminLink.classList.remove("hide");
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./signin.html");
    a.textContent = "Signin";
    signInOut.appendChild(a);
    adminLink.classList.add("hide");
  }
};

const cancelEditBtn = document.querySelector(".btn-cancel");
const publishBtn = document.querySelector(".btn-publish");
const onLeaveModal = document.querySelector(".leave-modal");
const onPublishModal = document.querySelector(".publish-modal");
const confirmPublish = document.querySelector(".btn-confirm-publish");
const confirmCancel = document.querySelector(".btn-confirm-cancel");
const returnToEdit = document.querySelectorAll(".btn-back");

const titleInput = document.querySelector("#title-input");
const imageInput = document.querySelector("#image-input");
const bodyInput = document.querySelector("#body-input");
const errorMessage = document.querySelector(".error-message");
const loader = document.querySelector(".loader-modal");

const validate = () => {
  if (titleInput.value.length < 10) {
    errorMessage.textContent = "The article title is short to be published";
    return false;
  } else if (bodyInput.value.length < 20) {
    errorMessage.textContent = "The article content is short to be published";
    return false;
  } else if (!imageInput.value) {
    errorMessage.textContent = "There is no image selected";
    return false;
  } else {
    return true;
  }
};

const handleOnCancelEdit = () => {
  onLeaveModal.classList.remove("hide");
};

const handleOnLeave = (e) => {
  if (titleInput.value || bodyInput.value || imageInput.value) {
    e.preventDefault();
    e.returnValue = "are you sure you want to leave";
  }
};

const handleOnPublish = () => {
  if (validate()) {
    errorMessage.classList.add("hide");
    onPublishModal.classList.remove("hide");
  } else {
    errorMessage.classList.remove("hide");
  }
};

const confirmModal = () => {
  loader.classList.remove("hide");
  const file = imageInput.files[0];
  const fileName = `${new Date().toLocaleString()}-${file.name}`;

  storageRef
    .child(fileName)
    .put(file)
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((url) => {
      db.collection("articles")
        .add({
          title: titleInput.value,
          body: bodyInput.value,
          imageUrl: url,
          publishedOn: new Date().toLocaleString(),
        })
        .then((res) => {
          loader.classList.add("hide");
          titleInput.value = "";
          bodyInput.value = "";
          imageInput.value = "";
          onLeaveModal.classList.add("hide");
          onPublishModal.classList.add("hide");
          displayNotification(
            "The article is published successfully!",
            "success"
          );
        });
    })
    .catch((err) => displayNotification(err, "error"));
};

const handleOnReturn = () => {
  onLeaveModal.classList.add("hide");
  onPublishModal.classList.add("hide");
};

const handleOnCancel = () => {
  onLeaveModal.classList.add("hide");
  onPublishModal.classList.add("hide");
  titleInput.value = "";
  bodyInput.value = "";
  imageInput.value = "";
};

cancelEditBtn.addEventListener("click", handleOnCancelEdit);
publishBtn.addEventListener("click", handleOnPublish);

confirmPublish.addEventListener("click", confirmModal);
confirmCancel.addEventListener("click", handleOnCancel);

returnToEdit.forEach((btn) => {
  btn.addEventListener("click", handleOnReturn);
});

if (isSignedIn === "true") {
  window.addEventListener("beforeunload", handleOnLeave);
}

responsive();
isAuthor(isSignedIn === "true" ? true : false);
