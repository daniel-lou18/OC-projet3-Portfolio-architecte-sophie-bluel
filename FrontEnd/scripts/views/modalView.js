class ModalView {
  constructor() {
    this.data = null;
    this.editLink = document.querySelector(".modify");
    this.backdrop = document.querySelector(".backdrop");
    this.modal = document.querySelector(".modal");
    this.imageList = document.querySelector(".modal-image-list");
    this.fieldsAddForm = document.querySelector(".fields-container");
    this.toAddForm = document.querySelector(".button-add");
    this.closeElement = document.querySelector(".modal-close");
  }

  renderModal(data) {
    this.clearProjects();
    this.data = data;
    this.backdrop.classList.remove("hidden");
    this.closeElement.addEventListener("click", this.closeModal.bind(this));
    this.backdrop.addEventListener("click", this.outsideClick.bind(this));
    this.data.forEach((project) => this.renderProject.call(this, project));
  }

  clearProjects() {
    this.imageList.innerHTML = "";
  }

  closeModal() {
    this.backdrop.classList.add("hidden");
    location.reload();
  }

  outsideClick(e) {
    if (this.modal.contains(e.target)) return;
    this.closeModal();
  }

  renderProject(project) {
    const markup = `
        <li data-id=${project.id}>
            <figure>
                <img src=${project.imageUrl} alt=${project.title} />
            </figure>
            <div class="icon-wrapper">
                <i class="fa-solid fa-trash-can fa-sm"></i>
            </div>
        </li>

        `;
    this.imageList.insertAdjacentHTML("beforeend", markup);
  }

  addHandlerRenderModal(handler) {
    this.editLink.addEventListener("click", (e) => {
      e.preventDefault();
      handler();
    });
  }

  addHandlerDeleteProject(handler) {
    Array.from(this.imageList.querySelectorAll("li")).forEach((elem) =>
      elem.addEventListener("click", async () => await handler(elem.dataset.id))
    );
  }

  /// Modale ajouter image ////

  renderAddForm(data) {
    this.data = data;
    this.imageList.remove();
    this.fieldsAddForm.style.display = "flex";
  }

  addHandlerRenderAddForm(handler) {
    this.toAddForm.addEventListener("click", handler);
  }
}

export default new ModalView();
