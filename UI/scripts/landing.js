import {
  displayNotification,
  showLoader,
  hideLoader,
} from "./helperFunctions.js";

const url = "https://my-brand-yo2d.onrender.com//api";

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.reload();
};

const handleLogin = () => {
  window.location.assign("./UI/pages/signin.html");
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

const highlightNav = () => {
  // highlighting the current nav
  const inPageLinks = document.querySelectorAll(".inpage-links");

  const experience = document.querySelector("#experience-section");
  const experienceOffsetTop = experience.offsetTop;
  const experienceHeight = experience.scrollHeight;

  const projects = document.querySelector("#projects-section");
  const projectsOffsetTop = projects.offsetTop;
  const projectsHeight = projects.scrollHeight;

  const contacts = document.querySelector("#contacts-section");
  const contactsOffsetTop = contacts.offsetTop;
  const contactsHeight = contacts.scrollHeight;

  const changeActiveLink = (selector) => {
    inPageLinks.forEach((inPagelink) =>
      inPagelink.classList.remove("active-nav")
    );
    if (selector) {
      const link = document.querySelector(selector);
      link.classList.add("active-nav");
    }
  };

  document.addEventListener("scroll", ({ target }) => {
    const scrollTop = window.pageYOffset;

    if (
      scrollTop > experienceOffsetTop &&
      scrollTop < experienceOffsetTop + experienceHeight
    ) {
      changeActiveLink(".link-to-experience");
    } else if (
      scrollTop > projectsOffsetTop &&
      scrollTop < projectsOffsetTop + projectsHeight
    ) {
      changeActiveLink(".link-to-projects");
    } else if (
      scrollTop > contactsOffsetTop &&
      scrollTop < contactsOffsetTop + contactsHeight
    ) {
      changeActiveLink(".link-to-contacts");
    } else {
      changeActiveLink(null);
    }
  });
};

const messageForm = document.querySelector("#leave-message-form");
const nameInput = document.querySelector("#name-input");
const emailInput = document.querySelector("#email-input");
const subjectInput = document.querySelector("#subject-input");
const messageInput = document.querySelector("#message-input");
const errorMessage = document.querySelector(".error-message");

const validate = () => {
  const emailRex = /\S+@\S+\.\S+/;

  if (nameInput.value.length < 4) {
    errorMessage.textContent = "The name must be at least 4 charcters long";
    return false;
  } else if (!emailRex.test(emailInput.value)) {
    errorMessage.textContent = "The email is not a valid email address";
    return false;
  } else if (subjectInput.value.length < 4) {
    errorMessage.textContent = "The subject must be at least 4 charcters long";
    return false;
  } else if (messageInput.value.length < 10) {
    errorMessage.textContent = "The message must be at least 10 charcters long";
    return false;
  } else {
    return true;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();

  if (validate()) {
    showLoader();
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({
        name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value,
      }),
    };

    fetch(`${url}/queries`, fetchOptions)
      .then((res) => {
        hideLoader();
        return res.json();
      })
      .then((data) => {
        errorMessage.classList.add("hide");
        nameInput.value = "";
        emailInput.value = "";
        subjectInput.value = "";
        messageInput.value = "";
        displayNotification(data.message, "success");
      })
      .catch((err) => {
        hideLoader();
        displayNotification(err, "error");
      });
  } else {
    errorMessage.classList.remove("hide");
  }
};

const displayInfo = (data) => {
  const infoTitle = document.querySelector(".profile-info-title");
  const infoSubTitle = document.querySelector(".profile-info-subtitle");
  const infoIntro = document.querySelector(".profile-info-intro");
  const infoProfileImage = document.querySelector(".profile-info-profileImage");
  const infoEmail = document.querySelector(".profile-info-email");
  const infoPhone = document.querySelector(".profile-info-phone");
  const infoAddress = document.querySelector(".profile-info-address");

  infoTitle.textContent = data.title;
  infoSubTitle.textContent = data.subTitle;
  infoIntro.innerHTML = `
  <span class="first-char">${data.intro.slice(0, 1)}</span> ${data.intro.slice(
    1
  )}
  `;
  infoProfileImage.src = data.profileImageUrl;
  infoProfileImage.classList.remove("hide");
  infoEmail.textContent = data.email;
  infoEmail.setAttribute("href", `mailto://${data.email}`);
  infoPhone.textContent = data.phone;
  infoAddress.textContent = data.address;
};

const displayItems = (items) => {
  hideLoader();
  const skillsCard = document.querySelector(".skills-cards-container");
  const projectsCard = document.querySelector(".projects-cards-container");
  const experiencesCard = document.querySelector("#experience-section");

  const displaySkill = (skill) => {
    const skillCard = `
    <div class="skill-card">
              <img src="${skill.logoUrl}" alt="${skill.title} logo" />
              <p>${skill.title}</p>
            </div>
    `;
    skillsCard.innerHTML += skillCard;
  };

  const displayProject = (project) => {
    const projectCard = `
    <div class="project-card">
              <img
                src="${project.logoUrl}"
                alt="${project.title} logo"
              />
              <h5>${project.title}</h5>
              <p>${project.description}</p>
              <a
                href="${project.link}"
                class="btn visit-project"
                target="_blank"
                ><button>Visit</button></a
              >
            </div>
    `;
    projectsCard.innerHTML += projectCard;
  };

  const displayExperience = (experience) => {
    const experienceCard = `
    <section class="individual-experience">
            <h6>${experience.title}</h6>
            <p>
            ${experience.description}
            </p>
          </section>
    `;
    experiencesCard.innerHTML += experienceCard;
  };

  items.forEach((item) => {
    switch (item.type) {
      case "skill":
        displaySkill(item);
        break;
      case "project":
        displayProject(item);
        break;
      case "experience":
        displayExperience(item);
        break;
      default:
        break;
    }
  });
  setTimeout(() => {
    highlightNav();
  }, 2000);
};

messageForm.addEventListener("submit", handleSubmit);

showLoader();
isAuthor();

fetch(`${url}/profile/info`)
  .then((res) => res.json())
  .then(({ data }) => displayInfo(data))
  .catch((err) => {
    hideLoader();
    displayNotification(err, "error");
  });

fetch(`${url}/profile`)
  .then((res) => res.json())
  .then(({ data }) => displayItems(data))
  .catch((err) => {
    hideLoader();
    displayNotification(err, "error");
  });
