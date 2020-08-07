import {
  displayNotification,
  showLoader,
  hideLoader,
} from "./helperFunctions.js";

const db = firebase.firestore();
const auth = firebase.auth();
const storageRef = firebase.storage().ref();

showLoader();
auth.onAuthStateChanged((user) => {
  hideLoader();
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
  const adminLink = document.querySelector(".admin-link");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");
  const authorEdits = document.querySelector(".edits");

  if (user) {
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

const currentArticleId = localStorage.getItem("current-article-id");
let currentArticle;

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

// handle responsiveness
const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

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
          .then((url) => {
            db.collection("articles")
              .doc(currentArticleId)
              .update({
                title: editTitle.value,
                body: editBody.value,
                imageUrl: url,
              })
              .then(() => {
                hideLoader();
                toggleModal();
                displayNotification("Article saved successfully", "success");
                window.location.reload();
              })
              .catch((err) => {
                displayNotification(err, "error");
                toggleModal();
              });
          })
          .catch((err) => {
            displayNotification(err, "error");
            toggleModal();
          });
      } else {
        db.collection("articles")
          .doc(currentArticleId)
          .update({
            title: editTitle.value,
            body: editBody.value,
          })
          .then(() => {
            hideLoader();
            displayNotification("Article saved successfully", "success");
            window.location.reload();
            toggleModal();
          })
          .catch((err) => {
            displayNotification(err, "error");
            toggleModal();
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
  showLoader();
  db.collection("articles")
    .doc(currentArticleId)
    .delete()
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
    comment = comment.doc.data();

    const commentsSection = document.querySelector(".previous-comments");
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    const commentAuthor = document.createElement("h6");
    commentAuthor.textContent = comment.author;

    const commentBody = document.createElement("p");
    commentBody.textContent = comment.body;

    const commentDate = document.createElement("p");
    commentDate.classList.add("comment-date");
    commentDate.textContent = `Commented on ${comment.publishedOn}`;

    commentElement.appendChild(commentAuthor);
    commentElement.appendChild(commentBody);
    commentElement.appendChild(commentDate);

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
    db.collection("comments")
      .add({
        articleId: currentArticleId,
        body: commentInput.value,
        email: emailInput.value,
        author: nameInput.value,
        publishedOn: new Date().toDateString(),
      })
      .then((res) => {
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

responsive();

db.collection("articles")
  .doc(currentArticleId)
  .get()
  .then((doc) => {
    const data = doc.data();

    if (data) {
      currentArticle = data;
      displayArticle(data);
    } else {
      displayNotification("Article can't be found now", "error");
    }
  })
  .catch((err) => {
    displayNotification(err, "error");
  });

db.collection("comments")
  .where("articleId", "==", currentArticleId)
  .onSnapshot(
    (snap) => {
      let changes = snap.docChanges();
      displayComments(changes);
    },
    (err) => {
      displayNotification(err, "error");
    }
  );
