import profileData from "./profileData.js";

const isSignedIn = localStorage.getItem("signedIn");

const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

const editModal = document.querySelector(".edit-modal");
const modalForm = document.querySelector(".edit-modal form");
const modalTitle = document.querySelector(".edit-modal .title");
const itemNameTitle = document.querySelector(".edit-modal p.item-name");
const itemNameInput = document.querySelector(".edit-modal input.item-name");
const itemDescriptionTitle = document.querySelector(
  ".edit-modal p.item-description"
);
const itemDescriptionInput = document.querySelector(
  ".edit-modal textarea.item-description"
);
const itemLinkTitle = document.querySelector(".edit-modal p.item-link");
const itemLinkInput = document.querySelector(".edit-modal input.item-link");
const itemLogoTitle = document.querySelector(".edit-modal p.item-logo");
const itemLogoPreview = document.querySelector(".edit-modal img.logo-preview");
const itemLogoInput = document.querySelector(".edit-modal input.item-logo");
const itemDeleteBtn = document.querySelector(
  ".edit-modal .btn.btn-delete-item"
);
const cancelBtn = document.querySelector(".edit-modal .btn.cancel");
const errorMessage = document.querySelector(".edit-modal .error-message");

const unhideModalContents = () => {
  [
    itemNameInput,
    itemNameTitle,
    itemDescriptionTitle,
    itemDescriptionInput,
    itemLogoInput,
    itemLinkTitle,
    itemLogoPreview,
    itemLinkTitle,
    itemLinkInput,
  ].forEach((item) => item.classList.remove("hide"));
};

const handleDeleteItem = (parentModal, itemName) => {
  const deleteModal = document.querySelector("section.delete-modal");
  const confirmDelete = deleteModal.querySelector(".btn-delete");
  const confirmReturn = deleteModal.querySelector(".btn-back");

  deleteModal.classList.remove("hide");

  confirmDelete.addEventListener("click", () => {
    deleteModal.classList.add("hide");
    unhideModalContents();
    parentModal.classList.add("hide");
    displayNotification(`${itemName} deleted successfully!`);
  });

  confirmReturn.addEventListener("click", () => {
    deleteModal.classList.add("hide");
  });
};

const handleCancel = (parentModal) => {
  const errorMessageAdd = document.querySelector(".add-modal .error-message");
  const onLeaveModal = document.querySelector(".leave-modal");
  onLeaveModal.classList.remove("hide");

  const confirmLeave = document.querySelector(".confirm-leave");
  const cancelLeave = document.querySelector(".cancel-leave");

  const handleOnCancel = () => {
    onLeaveModal.classList.add("hide");
  };

  const handleOnConfirm = () => {
    onLeaveModal.classList.add("hide");
    unhideModalContents();
    errorMessageAdd.textContent = "";
    parentModal.classList.add("hide");
  };

  confirmLeave.addEventListener("click", handleOnConfirm);
  cancelLeave.addEventListener("click", handleOnCancel);
};

const displaySkills = () => {
  const container = document.querySelector(".skills-cards-container");
  profileData.skills.map((skill) => {
    const skillCard = `
    <div class="skill-card">
              <span class="edit" title="Edit skill">Edit</span>
              <img src="${skill.imageSrc}" alt="${skill.name} logo" />
              <p class='title'>${skill.name}</p>
            </div>
    `;
    container.innerHTML += skillCard;
  });

  const skillsCards = container.querySelectorAll("div.skill-card:not(.add)");

  skillsCards.forEach((card) => {
    const cardEdit = card.querySelector(".edit");
    const cardTitle = card.querySelector(".title");
    const cardLogo = card.querySelector("img");

    cardEdit.addEventListener("click", () => {
      modalTitle.textContent = `Edit ${cardTitle.textContent}`;
      itemNameTitle.textContent = "Skill Name";
      itemNameInput.value = cardTitle.textContent;
      itemLogoTitle.textContent = "Skill Logo";
      itemLogoPreview.src = cardLogo.src;

      [
        itemDescriptionInput,
        itemDescriptionTitle,
        itemLinkInput,
        itemLinkTitle,
      ].forEach((item) => item.classList.add("hide"));

      editModal.classList.remove("hide");

      itemLogoInput.addEventListener("change", ({ target }) => {
        const file = target.files[0];

        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            itemLogoPreview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      });

      const validate = () => {
        if (itemNameInput.value.length < 2) {
          errorMessage.textContent =
            "The skill name must be at least 2 charcters long";
          return false;
        } else {
          displayNotification("Skill is updated successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          [
            itemDescriptionInput,
            itemDescriptionTitle,
            itemLinkInput,
            itemLinkTitle,
          ].forEach((item) => item.classList.remove("hide"));
          errorMessage.classList.add("hide");
          editModal.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, "Skill")
      );
      cancelBtn.addEventListener("click", () => handleCancel(editModal));
      modalForm.addEventListener("submit", handleSubmit);
    });
  });
};

const displaySocials = () => {
  const container = document.querySelector("#contacts-section section.socials");

  profileData.socials.map((social) => {
    const socialCard = `
      <div class='social-card'> 
      <span class='edit'>Edit</span>
      <a class="${social.name}" href="${social.link}">
      <img
        width="30px"
        height="28px"
        src="${social.logoSrc}"
        alt="${social.name} logo"
      />
    </a>
    <div>
      `;
    container.innerHTML += socialCard;
  });

  const socialCards = container.querySelectorAll("div.social-card");

  socialCards.forEach((card) => {
    const cardEdit = card.querySelector(".edit");
    const cardLink = card.querySelector("a");
    const cardTitle = cardLink.className;
    const cardLogo = card.querySelector("img");

    cardEdit.addEventListener("click", () => {
      modalTitle.textContent = `Edit ${cardTitle.textContent}`;
      itemNameTitle.textContent = "Profile Name";
      itemNameInput.value = cardTitle;
      itemLogoTitle.textContent = "Profile Logo";
      itemLogoPreview.src = cardLogo.src;
      itemLinkTitle.textContent = "Profile Link";
      itemLinkInput.value = cardLink.href;

      [itemDescriptionInput, itemDescriptionTitle].forEach((item) =>
        item.classList.add("hide")
      );

      editModal.classList.remove("hide");

      itemLogoInput.addEventListener("change", ({ target }) => {
        const file = target.files[0];

        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            itemLogoPreview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      });

      const validate = () => {
        if (itemNameInput.value.length < 2) {
          errorMessage.textContent =
            "The profile name must be at least 2 charcters long";
          return false;
        } else if (itemLinkInput.value.length < 2) {
          errorMessage.textContent = "Invalid project link";
          return false;
        } else {
          displayNotification("Social Profile is updated successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          [itemDescriptionInput, itemDescriptionTitle].forEach((item) =>
            item.classList.remove("hide")
          );
          editModal.classList.add("hide");
          errorMessage.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, "Social Profile")
      );
      cancelBtn.addEventListener("click", () => handleCancel(editModal));
      modalForm.addEventListener("submit", handleSubmit);
    });
  });
};

const displayExperiences = () => {
  const container = document.querySelector("section#experience-section");

  profileData.experience.map((experience) => {
    const experienceCard = `
    <section class="individual-experience">
            <span class="edit" title="Edit experience">Edit</span>
            <h6 class='title'>${experience.title}</h6>
            <p class='description'>${experience.description}</p>
          </section>
    `;
    container.innerHTML += experienceCard;
  });

  const experienceCards = container.querySelectorAll(
    "section.individual-experience:not(.add)"
  );

  experienceCards.forEach((card) => {
    const cardEdit = card.querySelector(".edit");
    const cardTitle = card.querySelector(".title");
    const cardDescription = card.querySelector(".description");

    cardEdit.addEventListener("click", () => {
      modalTitle.textContent = `Edit ${cardTitle.textContent}`;
      itemNameTitle.textContent = "Experience Title";
      itemNameInput.value = cardTitle.textContent;
      itemDescriptionTitle.textContent = "Experience Description";
      itemDescriptionInput.value = cardDescription.textContent;
      [
        itemLogoInput,
        itemLogoTitle,
        itemLogoPreview,
        itemLinkInput,
        itemLinkTitle,
      ].forEach((item) => item.classList.add("hide"));

      editModal.classList.remove("hide");

      const validate = () => {
        if (itemNameInput.value.length < 2) {
          errorMessage.textContent =
            "The experience title must be at least 2 charcters long";
          return false;
        } else if (itemDescriptionInput.value.length < 10) {
          errorMessage.textContent =
            "The project description must be at least 10 charcters long";
          return false;
        } else {
          displayNotification("Experience is updated successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          [
            itemLogoInput,
            itemLogoTitle,
            itemLogoPreview,
            itemLinkInput,
            itemLinkTitle,
          ].forEach((item) => item.classList.remove("hide"));
          errorMessage.classList.add("hide");
          editModal.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, "Experience")
      );
      cancelBtn.addEventListener("click", () => handleCancel(editModal));
      modalForm.addEventListener("submit", handleSubmit);
    });
  });
};

const displayProjects = () => {
  const container = document.querySelector(".projects-cards-container");

  profileData.projects.map((project) => {
    const projectCard = `
    <div class="project-card ${project.name}">
    <span class="edit" title="Edit Project">Edit</span>
    <img
      src="${project.imageSrc}"
      alt="${project.name} logo"
    />
    <h5 class="title">${project.name.toUpperCase()}</h5>
    <p class="description">${project.description}</p>
    <a
      href="${project.projectLink}"
      class="btn visit-project"
      target="_blank"
      ><button>Visit</button></a
    >
  </div>
    `;
    container.innerHTML += projectCard;
  });

  const projectCards = container.querySelectorAll("div.project-card");

  projectCards.forEach((card) => {
    const cardEdit = card.querySelector(".edit");
    const cardTitle = card.querySelector(".title");
    const cardLogo = card.querySelector("img");
    const cardLink = card.querySelector("a");
    const cardDescription = card.querySelector(".description");

    cardEdit.addEventListener("click", () => {
      modalTitle.textContent = `Edit ${cardTitle.textContent}`;
      itemNameTitle.textContent = "Project Name";
      itemNameInput.value = cardTitle.textContent;
      itemDescriptionTitle.textContent = "Project Description";
      itemDescriptionInput.value = cardDescription.textContent;
      itemLinkTitle.textContent = "Project Link";
      itemLinkInput.value = cardLink.href;
      itemLogoTitle.textContent = "Project Logo";
      itemLogoPreview.src = cardLogo.src;
      editModal.classList.remove("hide");

      itemLogoInput.addEventListener("change", ({ target }) => {
        const file = target.files[0];

        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            itemLogoPreview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      });

      const validate = () => {
        if (itemNameInput.value.length < 4) {
          errorMessage.textContent =
            "The project name must be at least 4 charcters long";
          return false;
        } else if (itemDescriptionInput.value.length < 10) {
          errorMessage.textContent =
            "The project description must be at least 10 charcters long";
          return false;
        } else if (itemLinkInput.value.length < 2) {
          errorMessage.textContent = "Invalid project link";
          return false;
        } else {
          displayNotification("Project is updated successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          editModal.classList.add("hide");
          errorMessage.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, "Project")
      );
      cancelBtn.addEventListener("click", () => handleCancel(editModal));
      modalForm.addEventListener("submit", handleSubmit);
    });
  });
};

const changePicture = () => {
  const changePictureModal = document.querySelector(
    "section.change-picture-modal"
  );
  const picturePreview = changePictureModal.querySelector(
    "img.profile-preview"
  );
  const pictureInput = changePictureModal.querySelector(
    "input.profile-picture-input"
  );
  const initialPicture = document.querySelector(
    ".profile-intro .profile-picture img"
  );
  const savePictureBtn = changePictureModal.querySelector(".btn.save");
  const cancelBtn = changePictureModal.querySelector(".btn.cancel");

  changePictureModal.classList.remove("hide");
  picturePreview.src = initialPicture.src;

  pictureInput.addEventListener("change", ({ target }) => {
    const file = target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        picturePreview.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });

  savePictureBtn.addEventListener("click", () => {
    changePictureModal.classList.add("hide");
    initialPicture.src = picturePreview.src;
    displayNotification("Picture updated successfully");
  });

  cancelBtn.addEventListener("click", () => handleCancel(changePictureModal));
};

const handleLogout = () => {
  localStorage.setItem("signedIn", false);
  window.location.reload();
  displayNotification("Signed out successfully");
};

const isAuthor = (authorized) => {
  const signInOut = document.querySelector(".sign-in-out-link");
  const adminLink = document.querySelector(".admin-link");
  const authorizedContents = document.querySelector("main");
  const unauthorizedContents = document.querySelector(
    "section.unauthorized-author"
  );

  if (authorized) {
    const button = document.createElement("button");
    button.setAttribute("class", "signout-btn");
    button.textContent = "Signout";
    button.addEventListener("click", handleLogout);
    signInOut.appendChild(button);
    adminLink.classList.remove("hide");
    authorizedContents.classList.remove("hide");
    unauthorizedContents.classList.add("hide");
  } else {
    const a = document.createElement("a");
    a.setAttribute("href", "./UI/pages/signin.html");
    a.textContent = "Signin";
    signInOut.appendChild(a);
    authorizedContents.classList.add("hide");
    unauthorizedContents.classList.remove("hide");
    adminLink.classList.add("hide");
  }
};

const addItems = () => {
  const fillAddModal = (contents) => {
    const addModal = document.querySelector(".add-modal");
    const modalTitle = document.querySelector(".add-modal .title");
    const itemNameTitle = document.querySelector(".add-modal p.item-name");
    const itemNameInput = document.querySelector(".add-modal input.item-name");
    const itemDescriptionTitle = document.querySelector(
      ".add-modal p.item-description"
    );
    const itemDescriptionInput = document.querySelector(
      ".add-modal textarea.item-description"
    );
    const itemLinkTitle = document.querySelector(".add-modal p.item-link");
    const itemLinkInput = document.querySelector(".add-modal input.item-link");
    const itemLogoTitle = document.querySelector(".add-modal p.item-logo");
    const itemLogoInput = document.querySelector(".add-modal input.item-logo");
    const cancelBtn = document.querySelector(".add-modal .btn.cancel");
    const errorMessage = document.querySelector(".add-modal .error-message");

    const addSkill = () => {
      addModal.classList.remove("hide");
      [
        itemDescriptionInput,
        itemDescriptionTitle,
        itemLinkInput,
        itemLinkTitle,
      ].forEach((item) => item.classList.add("hide"));

      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add a Skill";
      itemNameTitle.textContent = "Skill Name";
      itemLogoTitle.textContent = "Skill Logo";

      const validate = () => {
        if (itemNameInput.value.length < 2) {
          errorMessage.textContent =
            "The skill name must be at least 2 charcters long";
          return false;
        } else if (!itemLogoInput.value) {
          errorMessage.textContent = "There is no logo image selected";
          return false;
        } else {
          displayNotification("New Skill is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
          [
            itemDescriptionInput,
            itemDescriptionTitle,
            itemLinkInput,
            itemLinkTitle,
          ].forEach((item) => item.classList.remove("hide"));
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", () => handleCancel(addModal));
      modalForm.addEventListener("submit", handleSubmit);
    };

    const addExperience = () => {
      addModal.classList.remove("hide");
      [
        itemLogoInput,
        itemLogoTitle,
        itemLinkInput,
        itemLinkTitle,
      ].forEach((item) => item.classList.add("hide"));

      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add an Experience";
      itemNameTitle.textContent = "Experience Title";
      itemDescriptionTitle.textContent = "Experience Description";

      const validate = () => {
        if (itemNameInput.value.length < 6) {
          errorMessage.textContent =
            "The experience title must be at least 6 charcters long";
          return false;
        } else if (itemDescriptionInput.value < 20) {
          errorMessage.textContent =
            "The experience description must be at least 20 charcters long";
          return false;
        } else {
          displayNotification("New Experience is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
          [
            itemLogoInput,
            itemLogoTitle,
            itemLinkInput,
            itemLinkTitle,
          ].forEach((item) => item.classList.remove("hide"));
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", () => handleCancel(addModal));
      modalForm.addEventListener("submit", handleSubmit);
    };

    const addProject = () => {
      addModal.classList.remove("hide");

      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add a Project";
      itemNameTitle.textContent = "Project Name";
      itemLogoTitle.textContent = "Project Logo";
      itemLinkTitle.textContent = "Project Link";
      itemDescriptionTitle.textContent = "Project Description";

      const validate = () => {
        if (itemNameInput.value.length < 4) {
          errorMessage.textContent =
            "The project name must be at least 4 charcters long";
          return false;
        } else if (itemDescriptionInput.value.length < 10) {
          errorMessage.textContent =
            "The project description must be at least 10 charcters long";
          return false;
        } else if (itemLinkInput.value.length < 2) {
          errorMessage.textContent = "Invalid project link";
          return false;
        } else if (!itemLogoInput.value) {
          errorMessage.textContent = "There is no logo image selected";
          return false;
        } else {
          displayNotification("New Project is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", () => handleCancel(addModal));
      modalForm.addEventListener("submit", handleSubmit);
    };

    const addProfile = () => {
      addModal.classList.remove("hide");
      [
        itemDescriptionInput,
        itemDescriptionTitle,
        itemNameInput,
        itemNameTitle,
      ].forEach((item) => item.classList.add("hide"));

      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add a Social Media Profile";
      itemLinkTitle.textContent = "Profile link";
      itemLogoTitle.textContent = "Platform Logo";

      const validate = () => {
        if (itemLinkInput.value.length < 2) {
          errorMessage.textContent = "Invalid platform link";
          return false;
        } else if (!itemLogoInput.value) {
          errorMessage.textContent = "There is no logo image selected";
          return false;
        } else {
          displayNotification("New Profile is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
          [
            itemDescriptionInput,
            itemDescriptionTitle,
            itemLinkInput,
            itemLinkTitle,
          ].forEach((item) => item.classList.remove("hide"));
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", () => handleCancel(addModal));
      modalForm.addEventListener("submit", handleSubmit);
    };

    if (contents.itemType === "skill") {
      addSkill();
    } else if (contents.itemType === "experience") {
      addExperience();
    } else if (contents.itemType === "project") {
      addProject();
    } else if (contents.itemType === "social") {
      addProfile();
    }
  };

  const addSkillBtn = document.querySelector(".skill-card.add");
  const addExperienceBtn = document.querySelector(".individual-experience.add");
  const addProjectBtn = document.querySelector(".add-project");
  const addProfileBtn = document.querySelector(".add-social");

  addSkillBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "skill" });
  });

  addExperienceBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "experience" });
  });

  addProjectBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "project" });
  });

  addProfileBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "social" });
  });
};

const editItems = () => {
  const fillAddModal = (contents) => {
    const addModal = document.querySelector(".add-modal");
    const modalTitle = document.querySelector(".add-modal .title");
    const itemNameTitle = document.querySelector(".add-modal p.item-name");
    const itemNameInput = document.querySelector(".add-modal input.item-name");
    const itemDescriptionTitle = document.querySelector(
      ".add-modal p.item-description"
    );
    const itemDescriptionInput = document.querySelector(
      ".add-modal textarea.item-description"
    );
    const itemLinkTitle = document.querySelector(".add-modal p.item-link");
    const itemLinkInput = document.querySelector(".add-modal input.item-link");
    const itemLogoTitle = document.querySelector(".add-modal p.item-logo");
    const itemLogoInput = document.querySelector(".add-modal input.item-logo");
    const saveBtn = document.querySelector(".add-modal .btn.add-item");
    const cancelBtn = document.querySelector(".add-modal .btn.cancel");
    const errorMessage = document.querySelector(".error-message");
    const onLeaveModal = document.querySelector(".leave-modal");

    const handleCancel = () => {
      onLeaveModal.classList.remove("hide");

      const confirmLeave = document.querySelector(".confirm-leave");
      const cancelLeave = document.querySelector(".cancel-leave");

      const handleOnCancel = () => {
        onLeaveModal.classList.add("hide");
      };

      const handleOnConfirm = () => {
        onLeaveModal.classList.add("hide");
        addModal.classList.add("hide");
      };

      confirmLeave.addEventListener("click", handleOnConfirm);
      cancelLeave.addEventListener("click", handleOnCancel);
    };

    const unhideElements = (...els) => {
      els.forEach((el) => el.classList.remove("hide"));
    };

    const addSkill = () => {
      addModal.classList.remove("hide");

      const modalForm = document.querySelector(".add-modal form");
      unhideElements(
        itemNameTitle,
        itemNameInput,
        itemLogoInput,
        itemLogoTitle
      );

      modalTitle.textContent = "Add a Skill";
      itemNameTitle.textContent = "Skill Name";
      itemLogoTitle.textContent = "Skill Logo";

      const validate = () => {
        if (itemNameInput.value.length < 2) {
          errorMessage.textContent =
            "The skill name must be at least 2 charcters long";
          return false;
        } else if (!itemLogoInput.value) {
          errorMessage.textContent = "There is no logo image selected";
          return false;
        } else {
          errorMessage.textContent = "";
          displayNotification("New Skill is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
          errorMessage.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", handleCancel);
      modalForm.addEventListener("submit", handleSubmit);
    };

    const addExperience = () => {
      addModal.classList.remove("hide");
      unhideElements(
        itemNameInput,
        itemNameTitle,
        itemDescriptionInput,
        itemDescriptionTitle
      );
      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add an Experience";
      itemNameTitle.textContent = "Experience Title";
      itemDescriptionTitle.textContent = "Experience Description";

      const validate = () => {
        if (itemNameInput.value.length < 6) {
          errorMessage.textContent =
            "The experience title must be at least 6 charcters long";
          return false;
        } else if (itemDescriptionInput.value < 20) {
          errorMessage.textContent =
            "The experience description must be at least 20 charcters long";
          return false;
        } else {
          errorMessage.textContent = "";
          displayNotification("New Experience is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
          errorMessage.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", handleCancel);
      modalForm.addEventListener("submit", handleSubmit);
    };

    const addProject = () => {
      addModal.classList.remove("hide");
      unhideElements(
        itemNameTitle,
        itemNameInput,
        itemDescriptionTitle,
        itemDescriptionInput,
        itemLogoTitle,
        itemLogoInput,
        itemLinkTitle,
        itemLinkInput
      );

      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add a Project";
      itemNameTitle.textContent = "Project Name";
      itemLogoTitle.textContent = "Project Logo";
      itemLinkTitle.textContent = "Project Link";
      itemDescriptionTitle.textContent = "Project Description";

      const validate = () => {
        if (itemNameInput.value.length < 4) {
          errorMessage.textContent =
            "The project name must be at least 4 charcters long";
          return false;
        } else if (itemDescriptionInput.value.length < 10) {
          errorMessage.textContent =
            "The project description must be at least 10 charcters long";
          return false;
        } else if (itemLinkInput.value.length < 2) {
          errorMessage.textContent = "Invalid project link";
          return false;
        } else if (!itemLogoInput.value) {
          errorMessage.textContent = "There is no logo image selected";
          return false;
        } else {
          errorMessage.textContent = "";
          displayNotification("New Project is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", handleCancel);
      modalForm.addEventListener("submit", handleSubmit);
    };

    const addProfile = () => {
      addModal.classList.remove("hide");
      unhideElements(
        itemLinkTitle,
        itemLinkInput,
        itemNameTitle,
        itemNameInput,
        itemLogoTitle,
        itemLogoInput
      );
      const modalForm = document.querySelector(".add-modal form");
      modalTitle.textContent = "Add a Social Media Profile";
      itemNameTitle.textContent = "Profile Name";
      itemLinkTitle.textContent = "Profile link";
      itemLogoTitle.textContent = "Platform Logo";

      const validate = () => {
        if (itemNameInput.value.length < 2) {
          errorMessage.textContent =
            "The profile name must be at least 2 charcters long";
          return false;
        } else if (itemLinkInput.value.length < 2) {
          errorMessage.textContent = "Invalid platform link";
          return false;
        } else if (!itemLogoInput.value) {
          errorMessage.textContent = "There is no logo image selected";
          return false;
        } else {
          errorMessage.textContent = "";
          displayNotification("New Profile is added successfully!");
          return true;
        }
      };

      const handleSubmit = (e) => {
        e.preventDefault();

        if (validate()) {
          addModal.classList.add("hide");
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      cancelBtn.addEventListener("click", handleCancel);
      modalForm.addEventListener("submit", handleSubmit);
    };

    if (contents.itemType === "skill") {
      addSkill();
    } else if (contents.itemType === "experience") {
      addExperience();
    } else if (contents.itemType === "project") {
      addProject();
    } else if (contents.itemType === "social") {
      addProfile();
    }
  };

  const addSkillBtn = document.querySelector(".skill-card.add");
  const addExperienceBtn = document.querySelector(".individual-experience.add");
  const addProjectBtn = document.querySelector(".add-project");
  const addProfileBtn = document.querySelector(".add-social");

  addSkillBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "skill" });
  });

  addExperienceBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "experience" });
  });

  addProjectBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "project" });
  });

  addProfileBtn.addEventListener("click", () => {
    const contents = fillAddModal({ itemType: "social" });
  });
};

const editPageContents = () => {
  const inputGroups = document.querySelectorAll(".input-group");
  inputGroups.forEach((group) => {
    const input = group.querySelector(".input");
    const save = group.querySelector(".save");
    const errorMessage = group.querySelector(".error-message");

    const validate = () => {
      if (input.value.length < 8) {
        errorMessage.textContent = "Must be at least 8 charcters long";
        return false;
      } else {
        displayNotification("Info updated successfully!");
        return true;
      }
    };
    const handleSave = () => {
      if (validate()) {
        errorMessage.classList.add("hide");
      } else {
        errorMessage.classList.remove("hide");
      }
    };

    save.addEventListener("click", handleSave);
  });
};

const displayNotification = (message) => {
  const notification = document.querySelector(".notification");
  notification.textContent = message;
  notification.classList.remove("hide");

  setTimeout(() => {
    notification.classList.add("hide");
  }, 3000);
};

const changePictureBtn = document.querySelector(".profile-intro div.cover");
changePictureBtn.addEventListener("click", changePicture);

responsive();
isAuthor(isSignedIn === "true" ? true : false);
displaySkills();
displaySocials();
displayExperiences();
displayProjects();
addItems();
editItems();
editPageContents();
