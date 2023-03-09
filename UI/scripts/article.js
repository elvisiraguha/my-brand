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

const currentArticleId = localStorage.getItem("current-article-id");
let currentArticle;

const url = `https://my-brand-yo2d.onrender.com/api/articles/${currentArticleId}`;

const handleLogin = () => {
  window.location.assign("./signin.html");
};

const token = localStorage.getItem("token");

const isAuthor = () => {
  const adminLink = document.querySelector(".admin-link");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");
  const authorEdits = document.querySelector(".edits");

  if (token) {
    signInOutBtn.textContent = "SignOut";
    signInOutBtn.addEventListener("click", handleLogout);
    adminLink.classList.remove("hide");
    authorEdits.classList.add("authorized");
  } else {
    signInOutBtn.textContent = "SignIn";
    signInOutBtn.addEventListener("click", handleLogin);
    adminLink.classList.add("hide");
    authorEdits.classList.remove("authorized");
  }
};

// edit article button
const editArticle = document.querySelector("button.edit");
// delete article button
const deleteArticle = document.querySelector(".edits button.delete");
// edit modal
const editModal = document.querySelector(".modal");
// delete modal
const deleteModal = document.querySelector(".delete-modal");
// save and cancel buttons in the modal
const saveModal = document.querySelector(".modal-save");
const cancelModal = document.querySelector(".modal-cancel");

const confirmDelete = document.querySelector(".btn-delete");
const returnToArticle = document.querySelector(".btn-back");
const loader = document.querySelector(".loader-modal");

// fill the modal with current article
const fillModalContents = () => {
  const articleErrorMessage = document.querySelector(".modal .error-message");
  const editTitle = document.querySelector("input.modal-title");
  editTitle.value = currentArticle.title;

  const editBody = document.querySelector("textarea.modal-body");
  editBody.textContent = currentArticle.body;

  const imagePreview = document.querySelector(".modal-image-preview");
  imagePreview.src = currentArticle.imageUrl;
  const imageInput = document.querySelector(".modal-image-input");

  imageInput.addEventListener("change", ({ target }) => {
    const file = target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        imagePreview.src = reader.result;
      });
      reader.readAsDataURL(file);
    }
  });

  const validateArticle = () => {
    if (editTitle.value.length < 10) {
      articleErrorMessage.textContent = "The article title is short.";
      return false;
    } else if (editBody.value.length < 20) {
      articleErrorMessage.textContent = "The article content is short.";
      return false;
    } else {
      return true;
    }
  };

  const handleUpdateResponse = (data) => {
    hideLoader();
    toggleModal();
    displayNotification("Article saved successfully", "success");
    window.location.reload();
  };

  const handleUpdateError = (err) => {
    displayNotification(err, "error");
    hideLoader();
    toggleModal();
  };

  const handleSave = (e) => {
    if (validateArticle()) {
      showLoader();
      articleErrorMessage.classList.add("hide");

      if (imageInput.value) {
        const file = imageInput.files[0];
        const fileName = `${new Date().toLocaleString()}-${file.name}`;

        storageRef
          .child(fileName)
          .put(file)
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((imageUrl) => {
            const fetchOptions = {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({
                title: editTitle.value,
                content: editBody.value,
                imageUrl,
              }),
            };

            fetch(url, fetchOptions)
              .then((res) => res.json())
              .then((data) => {
                handleUpdateResponse(data);
              })
              .catch((err) => {
                handleUpdateError(err);
              });
          })
          .catch((err) => {
            handleUpdateError(err);
          });
      } else {
        const fetchOptions = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            title: editTitle.value,
            content: editBody.value,
          }),
        };

        fetch(url, fetchOptions)
          .then((res) => res.json())
          .then((data) => {
            handleUpdateResponse(data);
          })
          .catch((err) => {
            handleUpdateError(err);
          });
      }
    } else {
      articleErrorMessage.classList.remove("hide");
    }
  };

  saveModal.addEventListener("click", handleSave);
};

editArticle.addEventListener("click", () => {
  fillModalContents();
  toggleModal();
});

deleteArticle.addEventListener("click", (e) => {
  deleteModal.classList.remove("hide");
});

confirmDelete.addEventListener("click", () => {
  const fetchOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": token,
    },
  };

  showLoader();
  fetch(url, fetchOptions)
    .then((res) => res.json())
    .then(() => {
      hideLoader();
      displayNotification("Article deleted successfully!", "success");
      deleteModal.classList.toggle("hide");
      window.location.assign("blogs.html");
    });
});

returnToArticle.addEventListener("click", () => {
  deleteModal.classList.toggle("hide");
});

cancelModal.addEventListener("click", () => {
  toggleModal();
});

const toggleModal = () => {
  editModal.classList.toggle("hide");
};

const displayArticle = (data) => {
  document.title = data.title;

  const articlesSection = document.querySelector("section.article");
  const article = document.createElement("article");

  const blogTitle = document.createElement("h3");
  blogTitle.setAttribute("class", "article-title");
  blogTitle.textContent = data.title;

  const blogImage = document.createElement("img");
  blogImage.setAttribute("class", "article-image");
  blogImage.setAttribute("alt", "a random picture from picsum");
  blogImage.src = data.imageUrl;

  const bodyBreak = document.createElement("br");
  const blogBody = document.createElement("p");
  blogBody.setAttribute("class", "article-body");
  blogBody.textContent = data.body;

  const articleDate = document.createElement("p");
  articleDate.setAttribute("class", "article-date");

  articleDate.textContent = data.publishedOn;

  article.appendChild(blogTitle);
  article.appendChild(blogImage);
  article.appendChild(bodyBreak);
  article.appendChild(blogBody);
  article.appendChild(articleDate);

  articlesSection.appendChild(article);
};

const displayComments = (comments) => {
  comments.map((comment) => {
    const commentsSection = document.querySelector(".previous-comments");
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    const commentAuthor = document.createElement("h6");
    commentAuthor.textContent = comment.name;

    const commentBody = document.createElement("p");
    commentBody.textContent = comment.comment;

    commentElement.appendChild(commentAuthor);
    commentElement.appendChild(commentBody);

    commentsSection.appendChild(commentElement);
  });
};

const commentForm = document.querySelector(".comment-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const commentInput = document.querySelector("#comment-input");
const commentErrorMessage = document.querySelector(
  ".comment-form .error-message"
);

const validateComment = () => {
  const emailRex = /\S+@\S+\.\S+/;

  if (nameInput.value.length < 4) {
    commentErrorMessage.textContent =
      "The name must be at least 4 charcters long";
    return false;
  } else if (!emailRex.test(emailInput.value)) {
    commentErrorMessage.textContent = "The email is not a valid email address";
    return false;
  } else if (commentInput.value.length < 10) {
    commentErrorMessage.textContent =
      "The comment must be at least 10 charcters long";
    return false;
  } else {
    return true;
  }
};

const handleSubmit = (e) => {
  showLoader();
  e.preventDefault();

  if (validateComment()) {
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        comment: commentInput.value,
        email: emailInput.value,
        name: nameInput.value,
      }),
    };
    fetch(`${url}/comment`, fetchOptions)
      .then((res) => res.json())
      .then((data) => {
        commentErrorMessage.classList.add("hide");
        nameInput.value = "";
        emailInput.value = "";
        commentInput.value = "";
        hideLoader();
        displayNotification("Comment published successfully!", "success");
      })
      .catch((err) => {
        displayNotification(err, "error");
      });
  } else {
    commentErrorMessage.classList.remove("hide");
  }
};

commentForm.addEventListener("submit", handleSubmit);

isAuthor();

fetch(url)
  .then((res) => res.json())
  .then(({ data }) => {
    if (data) {
      currentArticle = data.article;
      displayArticle(currentArticle);
      displayComments(data.comments);
    } else {
      displayNotification("Article can't be found now", "error");
    }
  })
  .catch((err) => {
    displayNotification(err, "error");
  });
