const gallery = document.querySelector(".gallery");

const filter = document.querySelector(".filter");
// Récupération des projets
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    return works;
  }

  // Récupération des catégories
  async function getCategories() {
    const reponse = await fetch ("http://localhost:5678/api/categories/");
    const categories = await reponse.json();
    const buttonAll = {id:0, name:"Tous"};
    categories.unshift(buttonAll);
    return categories; 
  }

  // Création et affichage des boutons filtres
  async function categoriesButton() {
    const categories = await getCategories(); 
    for (let i=0; i < categories.length; i += 1) {
        const btn = document.createElement("button");
        btn.classList.add("button-filter");
        btn.innerText = categories[i].name;
        btn.setAttribute("id", categories[i].id);
        filter.appendChild(btn);
      
        if (categories[i].id === 0) {
            btn.classList.add(`button-filter-focus`);
        }
        btn.addEventListener(`click`, function () {
            const allbtnFilter = document.querySelectorAll('.button-filter');
            allbtnFilter.forEach(btn => {
                btn.classList.remove(`button-filter-focus`);
            });
            btn.classList.toggle(`button-filter-focus`);
            showWorks(categories[i].id);
        });
    }
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
      const figureWorks = document.createElement(`figure`);
      const figureImgWorks = document.createElement(`img`);
      const figureCaptionWorks = document.createElement(`figcaption`);
      figureImgWorks.src = work.imageUrl;
      figureImgWorks.alt = work.title; 
      gallery.appendChild(figureWorks);
      figureWorks.append(figureImgWorks, figureCaptionWorks);
    });
  }
  showWorks(0);