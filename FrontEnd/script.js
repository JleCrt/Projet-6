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
      //insertAdjacentHTML
      const figureWorks = document.createElement(`figure`);
      const figureImgWorks = document.createElement(`img`);
      const figureCaptionWorks = document.createElement(`figcaption`);
      figureImgWorks.src = work.imageUrl;
      figureImgWorks.alt = work.title; 
      figureCaptionWorks.textContent = work.title;
      gallery.appendChild(figureWorks);
      figureWorks.append(figureImgWorks, figureCaptionWorks);
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

// Affichage de la modal
const modalAppear = document.getElementById("modal-appear");
modalAppear.addEventListener("click", function () {
  modal.style.display = "block";
})

// Fermeture de la modal
const exitModal = document.querySelectorAll(".btn-exit");
exitModal.forEach(exitButton =>
  exitButton.addEventListener("click", function () {
    modalGallery.style.display = "flex";
    modal.style.display = "none";
  })
)
window.addEventListener("click", function (event) {
  if (event.target === modalContent) {
    modalGallery.style.display = "flex"
    modal.style.display = "none";
  }
});
