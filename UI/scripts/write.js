import {
  displayNotification,
  showLoader,
  hideLoader,
} from "./helperFunctions.js";

const storageRef = firebase.storage().ref();

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

const handleLogin = () => {
  window.location.assign("./signin.html");
};

const token = localStorage.getItem("token");

const isAuthor = () => {
  const writeArticle = document.querySelector(".write-article");
  const unauthorized = document.querySelector(".unauthorized-author");
  const adminLink = document.querySelector(".admin-link");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");

  if (token) {
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
  const url = "https://my-brand-yo2d.onrender.com//api/articles";

  storageRef
    .child(fileName)
    .put(file)
    .then((snapshot) => snapshot.ref.getDownloadURL())
    .then((imageUrl) => {
      const fetchOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          title: titleInput.value,
          content: bodyInput.value,
          imageUrl,
        }),
      };

      fetch(url, fetchOptions)
        .then((res) => {
          hideLoader();
          return res.json();
        })
        .then((data) => {
          titleInput.value = "";
          bodyInput.value = "";
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

isAuthor();
