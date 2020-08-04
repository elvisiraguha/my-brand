import { db } from "./firebase.config.js";

const articlesSection = document.querySelector("section.articles");
const paginationSection = document.querySelector(".pagination");

// check for signed in user
const isSignedIn = localStorage.getItem("signedIn");

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

const isAuthor = (authorized) => {
  const adminLink = document.querySelector(".admin-link");
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

const setCurrentArticle = (id) => {
  localStorage.setItem("current-article-id", id);
  window.location.assign("article.html");
};

let currentPage = 1;
let rows = 10;

const displayArticles = (latestBlogs, wrapper, rowsPerPage, page) => {
  wrapper.innerHTML = "";
  page -= 1;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedItems = latestBlogs.slice(start, end);

  paginatedItems.map((blogRaw) => {
    const blog = blogRaw.data();
    const article = document.createElement("article");

    // read more link
    const readMore = document.createElement("h5");
    readMore.textContent = "Read More";

    // blog date
    const articleDate = document.createElement("p");
    articleDate.setAttribute("class", "article-date");
    articleDate.textContent = blog.publishedOn;

    // blog title
    const blogTitle = document.createElement("h3");
    blogTitle.setAttribute("class", "article-title");
    blogTitle.textContent = blog.title;

    // blog image
    const blogImage = document.createElement("img");
    blogImage.setAttribute("class", "article-image");
    blogImage.setAttribute("alt", "a random picture from picsum");
    blogImage.src = blog.imageUrl;

    // set the clickedon article
    blogTitle.addEventListener("click", () => setCurrentArticle(blogRaw.id));
    readMore.addEventListener("click", () => setCurrentArticle(blogRaw.id));

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
    article.appendChild(blogImage);
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

    displayArticles(items, articlesSection, rows, currentPage);

    let currentBtn = document.querySelector(".pagination button.active");
    currentBtn.classList.remove("active");

    button.classList.add("active");
  });

  return button;
};

responsive();
isAuthor(isSignedIn === "true" ? true : false);

db.collection("articles")
  .get()
  .then((snapshot) => {
    displayArticles(snapshot.docs, articlesSection, rows, currentPage);
    setUpPagination(snapshot.docs, paginationSection, rows);
  })
  .catch((err) => {
    displayNotification(err, "error");
  });
