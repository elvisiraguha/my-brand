import { blogs } from "./blogsList.js";
import { comments } from "./comments.js";

// get current article id from browser storage
// and find that article in the articles array
const currentArticleId = localStorage.getItem("current-article-id");
const currentArticle = blogs.find(
  (blog) => blog.id === parseInt(currentArticleId, 10)
);

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
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./signin.html");
    a.textContent = "Signin";
    signInOut.appendChild(a);
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
  toggleModal();
});

confirmDelete.addEventListener("click", () => {
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

const displayArticle = () => {
  document.title = currentArticle.title;

  const articlesSection = document.querySelector("section.article");
  const article = document.createElement("article");

  const blogTitle = document.createElement("h3");
  blogTitle.setAttribute("class", "article-title");
  const titleNode = document.createTextNode(currentArticle.title);
  blogTitle.appendChild(titleNode);

  const blogImage = document.createElement("img");
  blogImage.setAttribute("class", "article-image");
  blogImage.setAttribute("alt", "a random picture from picsum");
  blogImage.src = currentArticle.imageUrl;

  const blogBody = document.createElement("p");
  blogBody.setAttribute("class", "article-body");
  const bodyNode = document.createTextNode(currentArticle.body);
  blogBody.appendChild(bodyNode);

  const articleDate = document.createElement("p");
  articleDate.setAttribute("class", "article-date");

  const dateNode = document.createTextNode(currentArticle.publishedOn);
  articleDate.appendChild(dateNode);

  article.appendChild(blogTitle);
  article.appendChild(blogImage);
  article.appendChild(blogBody);
  article.appendChild(articleDate);

  articlesSection.appendChild(article);
};

const displayComments = () => {
  const currentArticleComments = comments.filter(
    (comment) => comment.articleId === parseInt(currentArticleId, 10)
  );

  currentArticleComments.map((comment) => {
    const commentsSection = document.querySelector(".previous-comments");
    const commentElement = document.createElement("div");
    commentElement.classList.add("comment");

    const commentAuthor = document.createElement("h6");
    const authorText = document.createTextNode(comment.author);
    commentAuthor.appendChild(authorText);

    const commentBody = document.createElement("p");
    const bodyText = document.createTextNode(comment.body);
    commentBody.appendChild(bodyText);

    const commentDate = document.createElement("p");
    commentDate.classList.add("comment-date");
    const dateText = document.createTextNode(`Commented on ${comment.date}`);
    commentDate.appendChild(dateText);

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

const checkContents = () => {
  if (
    nameInput.value.length >= 4 &&
    emailInput.value.length >= 6 &&
    commentInput.value.length >= 10
  ) {
    return true;
  } else {
    return false;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (checkContents()) {
    errorMessage.classList.add("hide");
    nameInput.value = "";
    emailInput.value = "";
    commentInput.value = "";
  } else {
    errorMessage.classList.remove("hide");
  }
};

commentForm.addEventListener("submit", handleSubmit);

window.addEventListener("load", () => {
  // check for signed in user
  const isSignedIn = localStorage.getItem("signedIn");

  responsive();
  isAuthor(isSignedIn === "true" ? true : false);
  displayArticle();
  displayComments();
});
