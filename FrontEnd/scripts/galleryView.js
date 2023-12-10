class GalleryView {
  constructor() {
    this.data = null;
    this.galleryElement = document.querySelector(".gallery");
    this.filtersList = document.querySelector(".filters ul");
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

  renderCategory(data) {
    this.data = data;
    const markupTous = `
        <li class="filter-item">
            <a class="filter-link" href="#tous">Tous</a>
        </li>`;
    if (this.data === "Objets")
      this.filtersList.insertAdjacentHTML("beforeend", markupTous);
    const markup = `
        <li class="filter-item">
            <a class="filter-link" href="#${this.data}">${this.data}</a>
        </li>`;
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
