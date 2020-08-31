import {
  displayNotification,
  showLoader,
  hideLoader,
} from "./helperFunctions.js";

const storageRef = firebase.storage().ref();
const url = "https://my-brand.herokuapp.com/api/profile";

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
  const authorizedContents = document.querySelector("main");
  const unauthorizedContents = document.querySelector(
    "section.unauthorized-author"
  );

  if (token) {
    signInOutBtn.textContent = "SignOut";
    signInOutBtn.addEventListener("click", handleLogout);
    adminLink.classList.remove("hide");
    authorizedContents.classList.remove("hide");
    unauthorizedContents.classList.add("hide");
  } else {
    signInOutBtn.textContent = "SignIn";
    signInOutBtn.addEventListener("click", handleLogin);
    adminLink.classList.add("hide");
    authorizedContents.classList.add("hide");
    unauthorizedContents.classList.remove("hide");
  }
};

const responsive = () => {
  const burger = document.querySelector(".burger");
  const nav = document.querySelector("nav ul");

  burger.addEventListener("click", () => {
    nav.classList.toggle("nav-active");
    burger.classList.toggle("toggle");
  });
};

const addModal = document.querySelector(".add-modal");
const editModal = document.querySelector(".edit-modal");

const handleDeleteItem = (parentModal, itemId) => {
  const deleteModal = document.querySelector("section.delete-modal");
  const confirmDelete = deleteModal.querySelector(".btn-delete");
  const confirmReturn = deleteModal.querySelector(".btn-back");

  deleteModal.classList.remove("hide");

  confirmDelete.addEventListener("click", () => {
    showLoader();
    const fetchOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
    };

    fetch(`${url}/${itemId}`, fetchOptions)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        fetchItems();
        deleteModal.classList.add("hide");
        parentModal.classList.add("hide");
        displayNotification(data.message, "success");
      })
      .catch((err) => {
        hideLoader();
        displayNotification(err, "error");
      });
  });

  confirmReturn.addEventListener("click", () => {
    deleteModal.classList.add("hide");
  });
};

const handleCancel = (e, parentModal) => {
  e.preventDefault();
  const errorMessages = document.querySelectorAll(".error-message");
  const onLeaveModal = document.querySelector(".leave-modal");
  onLeaveModal.classList.remove("hide");

  const confirmLeave = document.querySelector(".confirm-leave");
  const cancelLeave = document.querySelector(".cancel-leave");

  const handleOnCancel = () => {
    onLeaveModal.classList.add("hide");
  };

  const handleOnConfirm = () => {
    onLeaveModal.classList.add("hide");
    errorMessages.forEach((p) => {
      p.textContent = "";
      p.classList.add("hide");
    });
    parentModal.classList.add("hide");
  };

  confirmLeave.addEventListener("click", handleOnConfirm);
  cancelLeave.addEventListener("click", handleOnCancel);
};

const changePicture = ({ profileImageUrl }) => {
  const changePictureBtn = document.querySelector(".profile-intro div.cover");
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
  changePictureBtn.addEventListener("click", () => {
    changePictureModal.classList.remove("hide");
  });
  const savePictureBtn = changePictureModal.querySelector(".btn.save");
  const cancelBtn = changePictureModal.querySelector(".btn.cancel");

  initialPicture.src = profileImageUrl;
  initialPicture.classList.remove("hide");
  picturePreview.src = profileImageUrl;

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
    if (picturePreview.src === profileImageUrl) {
      changePictureModal.classList.add("hide");
      return displayNotification("No changes have been made", "error");
    }
    showLoader();
    const file = pictureInput.files[0];
    const fileName = `${new Date().toLocaleString()}-${file.name}`;

    storageRef
      .child(fileName)
      .put(file)
      .then((snapshot) => snapshot.ref.getDownloadURL())
      .then((profileImageUrl) => {
        const fetchOptions = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            profileImageUrl,
          }),
        };

        fetch(`${url}/info`, fetchOptions)
          .then((res) => {
            return res.json();
          })
          .then(({ data }) => {
            initialPicture.src = "";
            initialPicture.src = data.profileImageUrl;
            hideLoader();
            changePictureModal.classList.add("hide");
            displayNotification("Picture updated successfully", "success");
          });
      })
      .catch((err) => displayNotification(err, "error"));
  });

  cancelBtn.addEventListener("click", (e) =>
    handleCancel(e, changePictureModal)
  );
};

const updateInfo = (data) => {
  hideLoader();
  changePicture(data);
  const inputGroups = document.querySelectorAll(".input-group");
  inputGroups.forEach((group) => {
    const infoKey = group.dataset.key;
    const input = group.querySelector(".input");
    const save = group.querySelector(".save");
    const errorMessage = group.querySelector(".error-message");

    let initialValue = data[infoKey];
    input.value = initialValue;

    const validate = () => {
      if (input.value.length < 8) {
        errorMessage.textContent = "Must be at least 8 charcters long";
        return false;
      } else {
        return true;
      }
    };

    const handleSave = () => {
      if (initialValue === input.value) {
        return displayNotification("No changes have been made", "error");
      }
      const fetchOptions = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
        body: JSON.stringify({
          [infoKey]: input.value,
        }),
      };
      if (validate()) {
        showLoader();
        errorMessage.classList.add("hide");

        fetch(`${url}/info`, fetchOptions)
          .then((res) => {
            hideLoader();
            return res.json();
          })
          .then((updated) => {
            const { message, data } = updated;
            displayNotification(message, "success");
            initialValue = data[infoKey];
            input.value = initialValue;
          })
          .catch((err) => {
            hideLoader();
            displayNotification(err, "error");
          });
      } else {
        errorMessage.classList.remove("hide");
      }
    };

    save.addEventListener("click", handleSave);
  });
};

const updateItems = (items) => {
  hideLoader();
  const skillsCard = document.querySelector(".skills-cards-container");
  const projectsCard = document.querySelector(".projects-cards-container");
  const experiencesCard = document.querySelector("#experience-section");

  skillsCard.innerHTML = `
  <div class="skill-card add" data-type="skill">
            <img src="../assets/skill-logos/plus.png" alt="plus image" />
            <p>
              Add Skill
            </p>
          </div>
  `;
  projectsCard.innerHTML = `
    <div class="add add-project" data-type="project">
              <img src="../assets/skill-logos/plus.png" alt="plus image" />
              <p>Add Project</p>
            </div>
    `;
  experiencesCard.innerHTML = `
    <h3>Experience:</h3>
          <section class="individual-experience add" data-type="experience">
            <img src="../assets/skill-logos/plus.png" alt="plus image" />
            <p>Add Experience</p>
          </section>
    `;

  const displaySkill = (skill) => {
    const skillCard = `
    <div class="skill-card"  data-id="${skill._id}">
    <span class="edit" title="Edit skill">🖊️</span>
              <img src="${skill.logoUrl}" alt="${skill.title} logo" />
              <p>${skill.title}</p>
            </div>
    `;
    skillsCard.innerHTML += skillCard;
  };

  const displayProject = (project) => {
    const projectCard = `
    <div class="project-card" data-id=${project._id}>
    <span class="edit" title="Edit Project">🖊️</span>
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
    <section class="individual-experience"  data-id=${experience._id}>
            <span class="edit" title="Edit experience">🖊️</span>
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
  setupAddItem();

  const editButtons = document.querySelectorAll(".edit");

  const updateModal = (item) => {
    const modalForm = document.querySelector(".edit-modal form");
    const modalTitle = document.querySelector(".edit-modal .title");
    const itemTitle = document.querySelector(".edit-modal input.item-name");
    const itemStartDate = document.querySelector(
      ".edit-modal input.item-startDate"
    );
    const itemEndDate = document.querySelector(
      ".edit-modal input.item-endDate"
    );
    const itemDescription = document.querySelector(
      ".edit-modal textarea.item-description"
    );
    const itemLink = document.querySelector(".edit-modal input.item-link");
    const itemLogoPreview = document.querySelector(
      ".edit-modal img.logo-preview"
    );
    const itemLogo = document.querySelector(".edit-modal input.item-logo");
    const itemDeleteBtn = document.querySelector(
      ".edit-modal .btn.btn-delete-item"
    );
    const cancelBtn = document.querySelector(".edit-modal .btn.cancel");
    const errorMessage = document.querySelector(".edit-modal .error-message");

    editModal.classList.remove("hide");
    cancelBtn.addEventListener("click", (e) => handleCancel(e, editModal));

    const validateSkill = () => {
      if (itemTitle.value.length < 2) {
        errorMessage.textContent =
          "The skill name must be at least 2 charcters long";
        return false;
      } else {
        return true;
      }
    };

    const validateExperience = () => {
      if (itemTitle.value.length < 6) {
        errorMessage.textContent =
          "The experience title must be at least 6 charcters long";
        return false;
      } else if (itemDescription.value < 20) {
        errorMessage.textContent =
          "The experience description must be at least 20 charcters long";
        return false;
      } else {
        return true;
      }
    };

    const validateProject = () => {
      if (itemTitle.value.length < 4) {
        errorMessage.textContent =
          "The project name must be at least 4 charcters long";
        return false;
      } else if (itemDescription.value.length < 10) {
        errorMessage.textContent =
          "The project description must be at least 10 charcters long";
        return false;
      } else if (itemLink.value.length < 2) {
        errorMessage.textContent = "Invalid project link";
        return false;
      } else {
        return true;
      }
    };

    const fillInSkill = (skill) => {
      editModal.dataset.type = "skill";
      modalTitle.textContent = `Edit ${skill.title}`;
      itemTitle.value = skill.title;
      itemLogoPreview.src = skill.logoUrl;

      itemLogo.addEventListener("change", ({ target }) => {
        const file = target.files[0];

        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            itemLogoPreview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      });

      const handleUpdateSkill = (e) => {
        e.preventDefault();

        if (validateSkill()) {
          showLoader();
          errorMessage.classList.add("hide");
          if (itemLogoPreview.src !== skill.logoUrl) {
            const file = itemLogo.files[0];
            const fileName = `${new Date().toLocaleString()}-${file.name}`;

            storageRef
              .child(fileName)
              .put(file)
              .then((snapshot) => snapshot.ref.getDownloadURL())
              .then((logoUrl) => {
                const fetchOptions = {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                  },
                  body: JSON.stringify({
                    title: itemTitle.value,
                    logoUrl,
                  }),
                };
                fetch(`${url}/${skill._id}`, fetchOptions)
                  .then((res) => {
                    return res.json();
                  })
                  .then((data) => {
                    editModal.classList.add("hide");
                    fetchItems();
                  })
                  .catch((err) => {
                    hideLoader();
                    displayNotification(err, "error");
                  });
              })
              .catch((err) => {
                hideLoader();
                displayNotification(err, "error");
              });
          } else {
            const fetchOptions = {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({
                title: itemTitle.value,
              }),
            };
            fetch(`${url}/${skill._id}`, fetchOptions)
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                editModal.classList.add("hide");
                fetchItems();
              })
              .catch((err) => {
                hideLoader();
                displayNotification(err, "error");
              });
          }
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, skill._id)
      );

      modalForm.addEventListener("submit", (e) => {
        handleUpdateSkill(e);
      });
    };

    const fillInProject = (project) => {
      editModal.dataset.type = "project";
      modalTitle.textContent = `Edit ${project.title}`;
      itemTitle.value = project.title;
      itemDescription.value = project.description;
      itemLink.value = project.link;
      itemLogoPreview.src = project.logoUrl;

      itemLogo.addEventListener("change", ({ target }) => {
        const file = target.files[0];

        if (file) {
          const reader = new FileReader();
          reader.addEventListener("load", () => {
            itemLogoPreview.src = reader.result;
          });

          reader.readAsDataURL(file);
        }
      });

      const handleUpdateProject = (e) => {
        e.preventDefault();

        if (validateProject()) {
          showLoader();
          errorMessage.classList.add("hide");
          if (itemLogoPreview.src !== project.logoUrl) {
            const file = itemLogo.files[0];
            const fileName = `${new Date().toLocaleString()}-${file.name}`;

            storageRef
              .child(fileName)
              .put(file)
              .then((snapshot) => snapshot.ref.getDownloadURL())
              .then((logoUrl) => {
                const fetchOptions = {
                  method: "PATCH",
                  headers: {
                    "Content-Type": "application/json",
                    "x-auth-token": token,
                  },
                  body: JSON.stringify({
                    title: itemTitle.value,
                    description: itemDescription.value,
                    link: itemLink.value,
                    logoUrl,
                  }),
                };
                fetch(`${url}/${project._id}`, fetchOptions)
                  .then((res) => {
                    return res.json();
                  })
                  .then((data) => {
                    editModal.classList.add("hide");
                    fetchItems();
                  })
                  .catch((err) => {
                    hideLoader();
                    displayNotification(err, "error");
                  });
              })
              .catch((err) => {
                hideLoader();
                displayNotification(err, "error");
              });
          } else {
            const fetchOptions = {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({
                title: itemTitle.value,
                description: itemDescription.value,
                link: itemLink.value,
              }),
            };

            fetch(`${url}/${project._id}`, fetchOptions)
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                editModal.classList.add("hide");
                fetchItems();
              })
              .catch((err) => {
                hideLoader();
                displayNotification(err, "error");
              });
          }
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, project._id)
      );
      modalForm.addEventListener("submit", (e) => {
        handleUpdateProject(e);
      });
    };

    const fillInExperience = (experience) => {
      editModal.dataset.type = "experience";
      modalTitle.textContent = `Edit ${experience.title}`;
      itemTitle.value = experience.title;
      itemStartDate.value = experience.startDate;
      itemEndDate.value = experience.endDate;
      itemDescription.value = experience.description;

      const handleUpdateExperience = (e) => {
        e.preventDefault();

        const fetchOptions = {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            title: itemTitle.value,
            description: itemDescription.value,
            startDate: itemStartDate.value,
            endDate: itemEndDate.value,
          }),
        };

        if (validateExperience()) {
          showLoader();
          errorMessage.classList.add("hide");
          fetch(`${url}/${experience._id}`, fetchOptions)
            .then((res) => {
              return res.json();
            })
            .then(({ data }) => {
              editModal.classList.add("hide");
              fetchItems();
            })
            .catch((err) => {
              hideLoader();
              displayNotification(err, "error");
            });
        } else {
          errorMessage.classList.remove("hide");
        }
      };

      itemDeleteBtn.addEventListener("click", () =>
        handleDeleteItem(editModal, experience._id)
      );
      modalForm.addEventListener("submit", (e) => {
        handleUpdateExperience(e);
      });
    };

    switch (item.type) {
      case "skill":
        fillInSkill(item);
        break;
      case "project":
        fillInProject(item);
        break;
      case "experience":
        fillInExperience(item);
        break;
      default:
        break;
    }
  };
  editButtons.forEach((editBtn) => {
    editBtn.addEventListener("click", ({ target }) => {
      const itemId = target.parentElement.dataset.id;
      const item = items.find((item) => itemId === item._id);
      updateModal(item);
    });
  });
};

const setupAddItem = () => {
  const modalForm = document.querySelector(".add-modal form");
  const modalTitle = document.querySelector(".add-modal .title");
  const itemTitle = document.querySelector(".add-modal input.item-name");
  const itemStartDate = document.querySelector(
    ".add-modal input.item-startDate"
  );
  const itemEndDate = document.querySelector(".add-modal input.item-endDate");
  const itemDescription = document.querySelector(
    ".add-modal textarea.item-description"
  );
  const itemLink = document.querySelector(".add-modal input.item-link");
  const itemLogoPreview = document.querySelector(".add-modal img.logo-preview");
  const itemLogo = document.querySelector(".add-modal input.item-logo");

  const cancelBtn = document.querySelector(".add-modal .btn.cancel");
  const errorMessage = document.querySelector(".add-modal .error-message");

  cancelBtn.addEventListener("click", (e) => handleCancel(e, addModal));
  const addBtns = document.querySelectorAll(".add");

  const cleanModal = () => {
    itemLogoPreview.src = "";
    itemLogoPreview.classList.add("hide");
    itemLogo.value = "";
    itemTitle.textContent = "";
    itemDescription.textContent = "";
    itemLogo.textContent = "";
  };

  const validateSkill = () => {
    if (itemTitle.value.length < 2) {
      errorMessage.textContent =
        "The skill name must be at least 2 charcters long";
      return false;
    } else if (!itemLogo.value) {
      errorMessage.textContent = "There is no logo image selected";
      return false;
    } else {
      errorMessage.textContent = "";
      return true;
    }
  };

  const validateExperience = () => {
    if (itemTitle.value.length < 6) {
      errorMessage.textContent =
        "The experience title must be at least 6 charcters long";
      return false;
    } else if (itemDescription.value < 20) {
      errorMessage.textContent =
        "The experience description must be at least 20 charcters long";
      return false;
    } else if (!itemStartDate.value) {
      errorMessage.textContent = "The start date must be specified";
      return false;
    } else if (!itemEndDate.value) {
      errorMessage.textContent = "The end date must be specified";
      return false;
    } else {
      errorMessage.textContent = "";
      return true;
    }
  };

  const validateProject = () => {
    if (itemTitle.value.length < 4) {
      errorMessage.textContent =
        "The project name must be at least 4 charcters long";
      return false;
    } else if (itemDescription.value.length < 10) {
      errorMessage.textContent =
        "The project description must be at least 10 charcters long";
      return false;
    } else if (itemLink.value.length < 2) {
      errorMessage.textContent = "Invalid project link";
      return false;
    } else if (!itemLogo.value) {
      errorMessage.textContent = "There is no logo image selected";
      return false;
    } else {
      errorMessage.textContent = "";
      return true;
    }
  };

  const handleAddSkill = () => {
    modalTitle.textContent = "Add a new skill";
    cleanModal();

    itemLogo.addEventListener("change", ({ target }) => {
      const file = target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          itemLogoPreview.src = reader.result;
          itemLogoPreview.classList.remove("hide");
        });

        reader.readAsDataURL(file);
      }
    });

    const handleSubmitSkill = (e) => {
      e.preventDefault();

      if (validateSkill()) {
        showLoader();
        const file = itemLogo.files[0];
        const fileName = `${new Date().toLocaleString()}-${file.name}`;

        storageRef
          .child(fileName)
          .put(file)
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((logoUrl) => {
            const fetchOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({
                title: itemTitle.value,
                logoUrl,
              }),
            };

            fetch(`${url}/?itemType=skill`, fetchOptions)
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                addModal.classList.add("hide");
                fetchItems();
                displayNotification(data.message, "success");
              });
          })
          .catch((err) => displayNotification(err, "error"));
      } else {
        errorMessage.classList.remove("hide");
      }
    };

    modalForm.addEventListener("submit", handleSubmitSkill);
  };
  const handleAddProject = () => {
    modalTitle.textContent = "Add a new project";
    cleanModal();

    itemLogo.addEventListener("change", ({ target }) => {
      const file = target.files[0];

      if (file) {
        const reader = new FileReader();
        reader.addEventListener("load", () => {
          itemLogoPreview.src = reader.result;
          itemLogoPreview.classList.remove("hide");
        });

        reader.readAsDataURL(file);
      }
    });

    const handleSubmitProject = (e) => {
      e.preventDefault();

      if (validateProject()) {
        showLoader();
        const file = itemLogo.files[0];
        const fileName = `${new Date().toLocaleString()}-${file.name}`;

        storageRef
          .child(fileName)
          .put(file)
          .then((snapshot) => snapshot.ref.getDownloadURL())
          .then((logoUrl) => {
            const fetchOptions = {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-auth-token": token,
              },
              body: JSON.stringify({
                title: itemTitle.value,
                description: itemDescription.value,
                link: itemLink.value,
                logoUrl,
              }),
            };

            fetch(`${url}/?itemType=project`, fetchOptions)
              .then((res) => {
                return res.json();
              })
              .then((data) => {
                addModal.classList.add("hide");
                fetchItems();
                displayNotification(data.message, "success");
              });
          })
          .catch((err) => displayNotification(err, "error"));
      } else {
        errorMessage.classList.remove("hide");
      }
    };

    modalForm.addEventListener("submit", handleSubmitProject);
  };
  const handleAddExperience = () => {
    modalTitle.textContent = "Add a new experience";
    const handleSubmitExperience = (e) => {
      e.preventDefault();

      if (validateExperience()) {
        showLoader();
        const fetchOptions = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
          body: JSON.stringify({
            title: itemTitle.value,
            description: itemDescription.value,
            startDate: itemStartDate.value,
            endDate: itemEndDate.value,
          }),
        };

        fetch(`${url}/?itemType=experience`, fetchOptions)
          .then((res) => {
            return res.json();
          })
          .then((data) => {
            addModal.classList.add("hide");
            fetchItems();
            displayNotification(data.message, "success");
          })
          .catch((err) => displayNotification(err, "error"));
      } else {
        errorMessage.classList.remove("hide");
      }
    };
    modalForm.addEventListener("submit", handleSubmitExperience);
  };

  addBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const itemType = btn.dataset.type;
      addModal.classList.remove("hide");

      switch (itemType) {
        case "skill":
          addModal.dataset.type = itemType;
          handleAddSkill();
          break;
        case "project":
          addModal.dataset.type = itemType;
          handleAddProject();
          break;
        case "experience":
          addModal.dataset.type = itemType;
          handleAddExperience();
          break;
        default:
          break;
      }
    });
  });
};

isAuthor();
responsive();

const fetchInfo = () => {
  fetch(`${url}/info`)
    .then((res) => res.json())
    .then(({ data }) => updateInfo(data))
    .catch((err) => {
      hideLoader();
      displayNotification(err, "error");
    });
};
const fetchItems = () => {
  fetch(url)
    .then((res) => res.json())
    .then(({ data }) => updateItems(data))
    .catch((err) => {
      displayNotification(err, "error");
    });
};

window.addEventListener("load", () => {
  showLoader();
  fetchItems();
  fetchInfo();
});
