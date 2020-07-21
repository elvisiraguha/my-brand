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
// edit modal
const editModal = document.querySelector(".modal");
// save and cancel buttons in the modal
const saveModal = document.querySelector(".modal-save");
const cancelModal = document.querySelector(".modal-cancel");

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

// close the modal when either cancel or save is clicked
saveModal.addEventListener("click", () => {
  toggleModal();
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

  const blogBody = document.createElement("p");
  blogBody.setAttribute("class", "article-body");
  const bodyNode = document.createTextNode(currentArticle.body);
  blogBody.appendChild(bodyNode);

  const articleDate = document.createElement("p");
  articleDate.setAttribute("class", "article-date");

  const dateNode = document.createTextNode(currentArticle.publishedOn);
  articleDate.appendChild(dateNode);

  article.appendChild(blogTitle);
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

window.addEventListener("load", () => {
  // check for signed in user
  const isSignedIn = localStorage.getItem("signedIn");

  responsive();
  isAuthor(isSignedIn === "true" ? true : false);
  displayArticle();
  displayComments();
});
