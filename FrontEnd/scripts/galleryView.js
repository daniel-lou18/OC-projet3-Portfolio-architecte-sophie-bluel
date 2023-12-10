class GalleryView {
  constructor() {
    this.data = null;
    this.galleryElement = document.querySelector(".gallery");
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

  ////////////////////////////////

  addHandlerRenderProjects(handler) {
    window.addEventListener("load", handler);
  }
}

export default new GalleryView();
