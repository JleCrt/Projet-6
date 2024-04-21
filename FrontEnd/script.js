const gallery = document.querySelector(".gallery");
const filter = document.querySelector(".filter");
const apiUrl = "http://localhost:5678/api/";

// Appels API
async function callAPI(endpoint) {
    const response = await fetch(apiUrl + endpoint);
    return await response.json();
}

// Récupération des projets
  async function getWorks() {
    return await callAPI("works");
  }

// Récupération des catégories
  async function getCategories() {
      const categories = await callAPI("categories/");
      const buttonAll = { id: 0, name: "Tous" };
      categories.unshift(buttonAll);
      return categories;
  }
  

// Création et affichage des boutons filtres
  async function categoriesButton() {
    const categories = await getCategories(); 
    categories.forEach(category => {
      const btn = document.createElement("button");
      btn.classList.add("button-filter");
      btn.innerText = category.name;
      btn.setAttribute("id", category.id);
      filter.appendChild(btn);
  
      if (category.id === 0) {
        btn.classList.add(`button-filter-focus`);
      }
      btn.addEventListener(`click`, function () {
        const allbtnFilter = document.querySelectorAll('.button-filter');
        allbtnFilter.forEach(btn => {
            btn.classList.remove(`button-filter-focus`);
        });
        btn.classList.toggle(`button-filter-focus`);
        showWorks(category.id);
     });
    });
  }
  categoriesButton();

// Affichage des projets
  async function showWorks(categoryId) {
    if (!gallery) {
      return;
    }
    gallery.innerHTML = "";
    let itemWorks = await getWorks();
    if (categoryId !== 0) {
      itemWorks = itemWorks.filter(work => work.categoryId === categoryId);
    }

    itemWorks.forEach(work => {
      const html = `
          <figure>
              <img src="${work.imageUrl}" alt="${work.title}">
              <figcaption>${work.title}</figcaption>
          </figure>
      `;
      gallery.insertAdjacentHTML('beforeend', html);
    });
  }
  showWorks(0);
  
// Connexion/Déconnexion et modifications 

  window.addEventListener("DOMContentLoaded", function () {
    const loginLink = document.getElementById("login");
    const logoutLink = document.getElementById("logout");
    // Apparition logout/Disparition login si token 
    if (localStorage.getItem("token")) {
      loginLink.style.display = "none";
      logoutLink.style.display = "inline-block"; 
      // Disparition logout/Apparition login si déconnexion
      logoutLink.addEventListener("click", function () {
        localStorage.removeItem("token");
        logoutLink.style.display = "none";
        loginLink.style.display = "inline-block";
      });
      // Affichage de la div container-edit
      const containerEdit = document.querySelector(".container-edit");
      containerEdit.style.display = "flex";
      // Affichage des boutons de modification
      const btnModify = document.querySelectorAll(".btn-modify");
      btnModify.forEach(function (button) {
        button.style.display = "inline-block";
      });
    } 
    else {
      // Disparition de logout/Apparition de login si pas de token
      logoutLink.style.display = "none";
      loginLink.style.display = "inline-block";
    }
  })


                      // MODAL

const modal = document.querySelector(".modal");
const modalContent = document.querySelector(".modal-content");
const modalGallery = document.getElementById("modal-gallery");
const modalAdd = document.getElementById("modal-add");

//  Affichage de la modal
const modalAppear = document.getElementById("modal-appear");
modalAppear.addEventListener("click", function () {
  modal.style.display = "block";
})

//  Fermeture de la modal
const modalExit = document.querySelectorAll(".btn-exit");
modalExit.forEach(buttonExit =>
  buttonExit.addEventListener("click", function () {
    modalGallery.style.display = "flex";
    modal.style.display = "none";
    modalAdd.style.display = "none";
  })
)
window.addEventListener("click", function (event) {
  if (event.target === modalContent) {
    modalGallery.style.display = "flex"
    modal.style.display = "none";
    modalAdd.style.display = "none";
  }
});

//  Passage sur la modal "ModalAdd"
const pictureAdd = document.querySelector(".btn-add-photo");
pictureAdd.addEventListener("click", function () {
  modalGallery.style.display = "none";
  modalAdd.style.display = "block";
})

//  Retour sur la modal "ModalGalery"
const returnModal = document.querySelector(".btn-back");
returnModal.addEventListener("click", function () {
  modalAdd.style.display = "none";
  modalGallery.style.display = "flex";
})


// MODAL GALLERY

// Affichage des projets dans modalGallery
function displayWorks(works) {
  works.forEach(work => {
    addFigureToGalleryContainer(work);
  });
}

// Ajout d'une figure 
function addFigureToGalleryContainer(work) {
  const galleryContainer = document.querySelector('.gallery-container');
  const figure = document.createElement('figure');
  const img = document.createElement('img');
  img.src = work.imageUrl;
  img.alt = work.title;
  figure.appendChild(img);

  const iconsContainer = document.createElement('div');
  iconsContainer.classList.add('icons-container');

  const deleteIcon = document.createElement('i');
  deleteIcon.classList.add('fa-solid', 'fa-trash-can');
  iconsContainer.appendChild(deleteIcon);
  figure.appendChild(iconsContainer);

  // Écouteurs d'événement pour la suppression d'un projet
  deleteIcon.addEventListener('click', async () => {
    await deleteWork(work.id);
    figure.remove();
  });
  galleryContainer.appendChild(figure);
}
//Suppression d'un projet
async function deleteWork(id) {
  const token = localStorage.getItem('token');
  if (!token) return;
  try {
      const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
          },
      });
      if (response.ok) {
          showWorks(0);
          console.log('Supprimé avec succès');
      } else {
          console.log('Une erreur s\'est produite lors de la suppression');
      }
  } catch (error) {
      console.log('Une erreur s\'est produite lors de la suppression', error);
  }
}
// Affichage des projets 
async function displayWorksInModal() {
  const works = await getWorks();
  displayWorks(works);
}
displayWorksInModal();

//  MODAL ADD

//  Gestion de l'aperçu de l'image uploadée
const addImgElements = document.querySelectorAll(".add-img i, .add-img label, .add-img input, .add-img p");
let image = document.getElementById("image-preview");

let previewPicture = function (e) {
  const [picture] = e.files;
  const imagePreview = document.getElementById("image-preview");
  if (picture) {
    //  Affichage du preview
    imagePreview.src = URL.createObjectURL(picture);
    imagePreview.style.display = "block";
    //  Masquer les autres éléments de la div
    addImgElements.forEach(element => {
      element.style.display = "none";
    });
  }
};


//  Gestion des catégories dans ModalAdd
const selectCategories = document.getElementById("categorie");

async function getCategoriesforLabel() {
  const response = await fetch("http://localhost:5678/api/categories");
  const categoriesForLabel = await response.json();
  // Réinitialiser le contenu du menu déroulant
  selectCategories.innerHTML = "";
  // Ajouter un champ vide
  const champVide = document.createElement("option");
  champVide.value = "";
  champVide.text = "";
  selectCategories.appendChild(champVide);
  // Parcourir les catégories et les ajouter au menu déroulant
  categoriesForLabel.forEach(category => {
    if (category !== "tous") {
      const optionnalCategories = document.createElement("option");
      optionnalCategories.value = category.id;
      optionnalCategories.text = category.name;
      selectCategories.appendChild(optionnalCategories);
    }
  });
}
getCategoriesforLabel();

// Gestion du submit du formulaire d'ajout de projet
const formUploadWorks = document.getElementById("send-img");
const submitBtnWorks = document.getElementById("btn-submit");

formUploadWorks.addEventListener("submit", submitWork);
// Soumettre le formulaire
function submitWork(e) {
  e.preventDefault();
  const token = localStorage.getItem("token");
  if (!token) {
    return;
  }

  const title = document.getElementById("titre").value;
  const category = document.getElementById("categorie").value;
  let image = document.getElementById("upload-img").files[0];

  if (!title || !category || !image) {
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("image", image);

// Envoi des données à l'API pour l'ajout d'un projet
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      "Authorization": "Bearer " + token
    },
    body: formData
  })
  .then(async (work) => {
    console.log("Image envoyée avec succès !");
    addFigureToGalleryContainer(await work.json());
    showWorks(0);
    modalAdd.style.display = "none";
    modalGallery.style.display = "flex";
    modal.style.display = "none";
    document.getElementById("titre").value = "";
    document.getElementById("categorie").value = "";
    image = document.getElementById("upload-img").innerHTML = "";
  })
  .catch(error => {
    console.log("Erreur lors de l'envoi de l'image :", error);
  });
}

function checkSubmitButton() {
  const errorMsgModal = document.querySelector(".error-modal");
  const title = document.getElementById("titre").value;
  const category = document.getElementById("categorie").value;
  const image = document.getElementById("upload-img").files[0];

  if (title && category && image) {
    submitBtnWorks.removeAttribute("disabled");
    submitBtnWorks.classList.add("active");
    errorMsgModal.textContent= "";
  }
  else {
    submitBtnWorks.setAttribute("disabled", "disabled");
    submitBtnWorks.classList.remove("active");
    errorMsgModal.textContent= "Tout les champs doivent être rempli !";
  }
}