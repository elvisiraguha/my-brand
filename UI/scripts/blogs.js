import { blogs } from "./blogsList.js";

const latestBlogs = blogs.sort(
  (latest, old) => new Date(old.publishedOn) - new Date(latest.publishedOn)
);

const articlesSection = document.querySelector("section.articles");
const paginationSection = document.querySelector(".pagination");

// handle responsiveness
const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
};

// display edits and write when user is signed in
const isAuthor = (authorized) => {
  // display edits when user is authorized
  const writeArticle = document.querySelector("section.main-header");
  authorized
    ? writeArticle.classList.add("authorized")
    : writeArticle.classList.remove("authorized");

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

const setCurrentArticle = (id) => {
  localStorage.setItem("current-article-id", id);
};

let currentPage = 1;
let rows = 10;

const displayArticles = (latestBlogs, wrapper, rowsPerPage, page) => {
  wrapper.innerHTML = "";
  page -= 1;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = latestBlogs.slice(start, end);

  paginatedItems.map((blog) => {
    const article = document.createElement("article");

    // read more link
    const readMore = document.createElement("a");
    readMore.setAttribute("href", "../pages/article.html");
    const readMoreNode = document.createTextNode("Read More");
    readMore.appendChild(readMoreNode);

    // blog date
    const articleDate = document.createElement("p");
    articleDate.setAttribute("class", "article-date");

    const dateNode = document.createTextNode(blog.publishedOn);
    articleDate.appendChild(dateNode);

    // blog title
    const blogTitle = document.createElement("a");
    blogTitle.setAttribute("class", "article-title");
    blogTitle.setAttribute("href", "../pages/article.html");

    const titleNode = document.createTextNode(blog.title);
    blogTitle.appendChild(titleNode);

    // set the clickedon article
    blogTitle.addEventListener("click", setCurrentArticle(blog.id));
    readMore.addEventListener("click", setCurrentArticle(blog.id));

    // blog preview
    const blogPreview = document.createElement("p");
    blogPreview.setAttribute("class", "article-preview");

    const previewNode = document.createTextNode(
      `${blog.body.slice(0, 150)}...  `
    );
    blogPreview.appendChild(previewNode);
    blogPreview.appendChild(readMore);

    article.appendChild(articleDate);
    article.appendChild(blogTitle);
    article.appendChild(blogPreview);

    wrapper.appendChild(article);
  });
};

const setUpPagination = (blogs, wrapper, rowsPerPage) => {
  wrapper.innerHTML = "";

  let pageCount = Math.ceil(blogs.length / rowsPerPage);

  for (let i = 1; i < pageCount + 1; i++) {
    let button = paginationButton(i, blogs);
    wrapper.appendChild(button);
  }
};

const paginationButton = (page, items) => {
  let button = document.createElement("button");
  let buttonText = document.createTextNode(page);
  button.appendChild(buttonText);

  if (currentPage === page) button.classList.add("active");

  button.addEventListener("click", () => {
    currentPage = page;

    displayArticles(latestBlogs, articlesSection, rows, currentPage);

    let currentBtn = document.querySelector(".pagination button.active");
    currentBtn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
};

window.addEventListener("load", () => {
  // check for signed in user
  const isSignedIn = localStorage.getItem("signedIn");

  responsive();
  isAuthor(isSignedIn === "true" ? true : false);
  displayArticles(latestBlogs, articlesSection, rows, currentPage);
  setUpPagination(latestBlogs, paginationSection, rows);
});
