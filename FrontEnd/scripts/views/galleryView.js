class GalleryView {
  constructor() {
    this.data = null;
    this.galleryElement = document.querySelector(".gallery");
    this.filtersList = document.querySelector(".filters ul");
    this.errorMessage = "Échec du chargement des images";
  }

  clearProjects() {
    this.galleryElement.innerHTML = "";
  }

  renderProject(data) {
    this.data = data;
    const markup = `
        <figure>
            <img src=${this.data.imageUrl} alt=${this.data.title} />
            <figcaption>${this.data.title}</figcaption>
        </figure>
    `;
    this.galleryElement.insertAdjacentHTML("beforeend", markup);
  }

  renderCategory(data, idx) {
    this.data = data;
    const markupTous = `
        <li class="filter-item filter-active">
            <a class="filter-link filter-active" href="#filter-tous">Tous</a>
        </li>`;
    // On ajoute le bouton "Tous" à la première itération de la boucle : renderCategory sera utilisé avec forEach
    if (idx === 0) this.filtersList.insertAdjacentHTML("beforeend", markupTous);
    const markup = `
        <li class="filter-item">
            <a class="filter-link" href="#filter-${
              this.data
            }">${this.data.replace("Hotels", "Hôtels")}</a>
        </li>`;
    this.filtersList.insertAdjacentHTML("beforeend", markup);

    // Code pour ajouter la classe "active" quand on clique sur une catégorie
    this.filtersList.addEventListener("click", (e) => {
      if (!e.target.closest(".filter-link")) return;
      // On enlève d'abord les classes "filter-active" de tous les liens
      Array.from(this.filtersList.querySelectorAll(".filter-link")).forEach(
        (elem) => elem.classList.remove("filter-active")
      );
      // On rajoute la classe "filter-active" au lien sur lequel l'utilisateur a cliqué
      e.target.closest(".filter-link").classList.add("filter-active");
    });
  }

  renderGalleryError(errorMessage = this.errorMessage) {
    const markup = `<p class="error-message">${errorMessage}</p`;
    this.galleryElement.insertAdjacentHTML("beforeend", markup);
  }

  renderCategoriesError(errorMessage = this.errorMessage) {
    const markup = `<p class="error-message">${errorMessage}</p`;
    this.filtersList.insertAdjacentHTML("beforeend", markup);
  }

  ////////////////////////////////

  addHandlerRenderProjects(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerRenderCategories(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerFilterProjects(handler) {
    window.addEventListener("hashchange", handler);
  }
}

export default new GalleryView();
