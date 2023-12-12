class ModalView {
  constructor() {
    this.data = null;
    this.editLink = document.querySelector(".modify");
    this.backdrop = document.querySelector(".backdrop");
    this.parentElement = document.querySelector(".modal-image-list");
    this.closeElement = document.querySelector(".modal-close");
  }

  renderModal(data) {
    this.data = data;
    this.backdrop.classList.remove("hidden");
    this.closeElement.addEventListener("click", this.closeModal.bind(this));
    this.data.forEach((project) => this.renderProject.call(this, project));
  }

  closeModal() {
    this.backdrop.classList.add("hidden");
  }

  renderProject(project) {
    const markup = `
            <figure>
                <img src=${project.imageUrl} alt=${project.title} />
            </figure>
        `;
    this.parentElement.insertAdjacentHTML("beforeend", markup);
  }

  addHandlerRenderModal(handler) {
    this.editLink.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  }
}

export default new ModalView();
