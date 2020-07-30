import { queries } from "./queriesList.js";

const isSignedIn = localStorage.getItem("signedIn");

const displayNotification = (message) => {
  const notification = document.querySelector(".notification");
  notification.textContent = message;
  notification.classList.remove("hide");

  setTimeout(() => {
    notification.classList.add("hide");
  }, 3000);
};

const sortedQueries = (function () {
  const sortedByDate = queries.sort(
    (latest, old) => new Date(latest.date) - new Date(old.date)
  );
  const sortedByDone = sortedByDate.sort(
    (done, undone) => done.read - undone.read
  );
  return sortedByDone;
})();

const paginationSection = document.querySelector(".pagination");
const queriesSection = document.querySelector("section.messages");

const handleActions = () => {
  const emailInput = document.querySelector("#email-input");
  const replyInput = document.querySelector("#reply-input");
  const errorMessage = document.querySelector(".error-message");

  const replyBtns = document.querySelectorAll("button.reply");
  const readBtns = document.querySelectorAll("button.read");
  const cancelBtn = document.querySelector("button.modal-cancel");
  const replyForm = document.querySelector("#reply-form");
  const replyModal = document.querySelector(".reply-modal");

  replyBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleModal();
      replyInput.value = "";
    });
  });

  readBtns.forEach((btn) => {
    btn.addEventListener("click", ({ target }) => {
      target.classList.toggle("read-on");
      if (target.textContent === "Read") {
        displayNotification("Marked read");
        target.innerHTML = "&#10004;";
      } else {
        displayNotification("Marked unread");
        target.textContent = "Read";
      }
    });
  });

  const validate = () => {
    const emailRex = /\S+@\S+\.\S+/;

    if (!emailRex.test(emailInput.value)) {
      errorMessage.textContent = "The email is not a valid email address";
      return false;
    } else if (replyInput.value.length < 4) {
      errorMessage.textContent = "The reply must be at least 10 charcters long";
      return false;
    } else {
      displayNotification("The reply is sent successfully!");
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      errorMessage.classList.add("hide");
      emailInput.value = "";
      replyInput.value = "";
      toggleModal();
    } else {
      errorMessage.classList.remove("hide");
    }
  };

  replyForm.addEventListener("submit", handleSubmit);

  cancelBtn.addEventListener("click", () => {
    emailInput.value = "";
    replyInput.value = "";
    toggleModal();
  });

  const toggleModal = () => {
    replyModal.classList.toggle("hide");
  };
};

const displayQueries = (sortedQueries, wrapper, rowsPerPage, page) => {
  wrapper.innerHTML = "";
  page -= 1;

  let start = rowsPerPage * page;
  let end = start + rowsPerPage;
  let paginatedQueries = sortedQueries.slice(start, end);

  paginatedQueries.map((querie) => {
    const readOnClass = querie.read ? "read-on" : "";
    const readContent = querie.read ? "&#10004;" : "Read";
    const displayedQuerie = `
          <div class="message">
            <h4><i>Sender Name:</i> ${querie.senderName}</h4>
            <h4><i>Subject:</i> ${querie.subject}</h4>
            <h4>
              <i>Email:</i> <a href="mail://${querie.senderEmail}">${querie.senderEmail}</a>
            </h4>
            <p>
              ${querie.message}
            </p>
            <p class='sent-date'>${querie.date}</p>
            <div class="controls">
              <button class="btn reply">Reply</button>
              <button class="btn read ${readOnClass}">${readContent}</button>
            </div>
          </div>
    `;
    wrapper.innerHTML += displayedQuerie;
  });
  handleActions();
};

const setUpPagination = (queries, wrapper, rowsPerPage) => {
  wrapper.innerHTML = "";

  let pageCount = Math.ceil(queries.length / rowsPerPage);

  for (let i = 1; i < pageCount + 1; i++) {
    let button = paginationButton(i, queries);
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

    displayQueries(sortedQueries, queriesSection, rows, currentPage);

    let currentBtn = document.querySelector(".pagination button.active");
    currentBtn.classList.remove("active");

    button.classList.add("active");
  });
  return button;
};

const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
  displayNotification("Signed out successfully");
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
  const message = document.querySelector(".messages");
  const unauthorized = document.querySelector(".unauthorized-author");

  if (authorized) {
    message.classList.remove("hide");
    adminLink.classList.remove("hide");
    unauthorized.classList.add("hide");
  } else {
    message.classList.add("hide");
    adminLink.classList.add("hide");
    unauthorized.classList.remove("hide");
  }

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

let currentPage = 1;
let rows = 10;

responsive();
isAuthor(isSignedIn === "true" ? true : false);
displayQueries(sortedQueries, queriesSection, rows, currentPage);
setUpPagination(sortedQueries, paginationSection, rows);
