import {
  showLoader,
  hideLoader,
  displayNotification,
} from "../scripts/helperFunctions.js";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

const handleLogin = () => {
  window.location.assign("./signin.html");
};

const token = localStorage.getItem("token");

const isAuthor = () => {
  const adminLink = document.querySelector(".admin-link");
  const signInOutBtn = document.querySelector(".sign-in-out-link button");

  if (token) {
    signInOutBtn.textContent = "SignOut";
    signInOutBtn.addEventListener("click", handleLogout);
    adminLink.classList.remove("hide");
  } else {
    signInOutBtn.textContent = "SignIn";
    signInOutBtn.addEventListener("click", handleLogin);
    adminLink.classList.add("hide");
  }
};

const articlesSection = document.querySelector("section.articles");
const paginationSection = document.querySelector(".pagination");

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

  paginatedItems.map((blog) => {
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
    blogImage.setAttribute("height", "350px");
    blogImage.src = blog.imageUrl;

    // set the clickedon article
    blogTitle.addEventListener("click", () => setCurrentArticle(blog._id));
    readMore.addEventListener("click", () => setCurrentArticle(blog._id));

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

isAuthor();
showLoader();

const url = "https://my-brand.herokuapp.com/api/articles";

fetch(url)
  .then((res) => res.json())
  .then(({ data }) => {
    hideLoader();
    displayArticles(data, articlesSection, rows, currentPage);
    setUpPagination(data, paginationSection, rows);
  })
  .catch((err) => {
    hideLoader();
    displayNotification(err, "error");
  });
