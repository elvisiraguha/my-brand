import {
  displayNotification,
  showLoader,
  hideLoader,
} from "./helperFunctions.js";

const db = firebase.firestore();
const auth = firebase.auth();
const storageRef = firebase.storage().ref();

auth.onAuthStateChanged((user) => {
  isAuthor(user);
});

const handleLogout = () => {
  showLoader();
  auth
    .signOut()
    .then(() => {
      hideLoader();
    })
    .catch((err) => {
      hideLoader();
      displayNotification(err, "error");
    });
};

const handleLogin = () => {
  window.location.assign("./signin.html");
};

const isAuthor = (user) => {
  const writeArticle = document.querySelector(".write-article");
  const unauthorized = document.querySelector(".unauthorized-author");
  const adminLink = document.querySelector(".admin-link");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");

  if (user) {
    signInOutBtn.textContent = "SignOut";
    signInOutBtn.addEventListener("click", handleLogout);
    adminLink.classList.remove("hide");
    writeArticle.classList.remove("hide");
    unauthorized.classList.add("hide");
  } else {
    signInOutBtn.textContent = "SignIn";
    signInOutBtn.addEventListener("click", handleLogin);
    adminLink.classList.add("hide");
    writeArticle.classList.add("hide");
    unauthorized.classList.remove("hide");
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
  showLoader();
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
          hideLoader();
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

window.addEventListener("beforeunload", handleOnLeave);

responsive();
