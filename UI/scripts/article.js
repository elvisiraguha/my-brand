import { db } from "./firebase.config.js";
import {displayNotification} from './helperFunctions.js'

const currentArticleId = localStorage.getItem("current-article-id");

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

const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
  displayNotification("Signed out successfully", "success");
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
  const adminLink = document.querySelector(".admin-link");

  // display edits when user is authorized
  const authorEdits = document.querySelector(".edits");
  authorized
    ? authorEdits.classList.add("authorized")
    : authorEdits.classList.remove("authorized");

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

// fill the modal with current article
const fillModalContents = () => {
  const editTitle = document.querySelector("input.modal-title");
  editTitle.value = currentArticle.title;

  const editBody = document.querySelector("textarea.modal-body");
  editBody.textContent = currentArticle.body;
};

// show modal when edit is clicked
editArticle.addEventListener("click", () => {
  fillModalContents();
  toggleModal();
});

deleteArticle.addEventListener("click", (e) => {
  deleteModal.classList.remove("hide");
});

// close the modal when either cancel or save is clicked
saveModal.addEventListener("click", () => {
  displayNotification("Article saved successfully", "success");
  toggleModal();
});

confirmDelete.addEventListener("click", () => {
  displayNotification("Article deleted successfully!", "success");
  deleteModal.classList.toggle("hide");
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

const displayArticle = (currentArticle) => {
  document.title = currentArticle.title;

  const articlesSection = document.querySelector("section.article");
  const article = document.createElement("article");

  const blogTitle = document.createElement("h3");
  blogTitle.setAttribute("class", "article-title");
  blogTitle.textContent = currentArticle.title;

  const blogImage = document.createElement("img");
  blogImage.setAttribute("class", "article-image");
  blogImage.setAttribute("alt", "a random picture from picsum");
  blogImage.src = currentArticle.imageUrl;

  const blogBody = document.createElement("p");
  blogBody.setAttribute("class", "article-body");
  blogBody.textContent = currentArticle.body;

  const articleDate = document.createElement("p");
  articleDate.setAttribute("class", "article-date");

  articleDate.textContent = currentArticle.publishedOn;

  article.appendChild(blogTitle);
  article.appendChild(blogImage);
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
const errorMessage = document.querySelector(".error-message");

const validate = () => {
  const emailRex = /\S+@\S+\.\S+/;

  if (nameInput.value.length < 4) {
    errorMessage.textContent = "The name must be at least 4 charcters long";
    return false;
  } else if (!emailRex.test(emailInput.value)) {
    errorMessage.textContent = "The email is not a valid email address";
    return false;
  } else if (commentInput.value.length < 10) {
    errorMessage.textContent = "The comment must be at least 10 charcters long";
    return false;
  } else {
    return true;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validate()) {
    db.collection("comments")
      .add({
        articleId: currentArticleId,
        body: commentInput.value,
        email: emailInput.value,
        author: nameInput.value,
        publishedOn: new Date().toDateString(),
      })
      .then((res) => {
        errorMessage.classList.add("hide");
        nameInput.value = "";
        emailInput.value = "";
        commentInput.value = "";
        displayNotification("Comment published successfully!", "success");
      })
      .catch((err) => {
        displayNotification(err, "error");
      });
  } else {
    errorMessage.classList.remove("hide");
  }
};

commentForm.addEventListener("submit", handleSubmit);

const isSignedIn = localStorage.getItem("signedIn");

responsive();
isAuthor(isSignedIn === "true" ? true : false);

db.collection("articles")
  .doc(currentArticleId)
  .get()
  .then((doc) => {
    const data = doc.data();

    if (data) {
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
