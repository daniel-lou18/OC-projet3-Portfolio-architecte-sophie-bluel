class ModalView {
  constructor() {
    this.data = null;
    this.addFormRendered = false;
    this.editLink = document.querySelector(".modify");
    this.backdrop = document.querySelector(".backdrop");
    this.modal = document.querySelector(".modal");
    this.form = document.querySelector(".modal-form");
    this.imageList = document.querySelector(".modal-image-list");
    this.fieldsAddForm = document.querySelector(".fields-container");
    this.buttonNext = document.querySelector(".button-next");
    this.buttonValidate = document.querySelector(".button-add");
    this.closeElement = document.querySelector(".modal-close");
    this.selectCategory = document.querySelector("select#category");
    this.title = document.querySelector(".modal-title");
    this.back = document.querySelector(".modal-back");
    this.file = document.querySelector("#file");
    this.uploadElement = document.querySelector(".upload-container");
    this.errorMessage = "🚨 Une erreur est survenue";
  }

  renderModal(data) {
    this.clearProjects();
    this.data = data;
    this.backdrop.classList.remove("hidden");
    // Utiliser les méthodes bind et call pour attacher la valeur de "this" à l'instance de la classe car
    // la valeur de this dans une fonction de retour d'un eventlistener sera la balise auquel le listener sera attaché
    this.closeElement.addEventListener("click", this.closeModal.bind(this));
    this.backdrop.addEventListener("click", this.outsideClick.bind(this));
    this.data.forEach((project) => this.renderProject.call(this, project));
  }

  clearProjects() {
    this.imageList.innerHTML = "";
  }

  clearErrorMessage() {
    this.modal.querySelector(".error-message")?.remove();
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
    this.editLink.addEventListener("click", handler);
  }

  addHandlerDeleteProject(handler) {
    // la fonction de rappel est asynchrone donc il faut la mettre dans une autre fonction async pour pouvoir utiliser await
    Array.from(this.imageList.querySelectorAll("li")).forEach((elem) =>
      elem.addEventListener("click", async () => await handler(elem.dataset.id))
    );
  }

  addHandlerRenderAddForm(handler) {
    this.buttonNext.addEventListener("click", handler);
  }

  /// Modale ajouter image ////

  renderAddForm(data) {
    this.buttonValidate.setAttribute("disabled", "");
    this.clearErrorMessage();
    this.data = data;
    this.title.textContent = "Ajout photo";
    this.back.style.visibility = "visible";
    this.imageList.style.display = "none";
    this.fieldsAddForm.style.display = "flex";
    this.buttonNext.style.display = "none";
    this.buttonValidate.classList.remove("hidden");
    this.checkIfRendered();
    this.addFormRendered = true;
  }

  checkIfRendered() {
    if (!this.addFormRendered) {
      /// Pour éviter d'ajouter les catégories au menu select quand on revient en arrière et on clique de nouveau sur le bouton "Ajouter une photo"
      this.data.forEach((cat, idx) =>
        this.renderProjectCategory.call(this, cat, idx)
      );
      /// Ajouter la fonction aux balises input et select du formulaire pour vérifier si tous les champs sont remplis
      Array.from(this.form.querySelectorAll(".field")).forEach((field) =>
        field.addEventListener("change", this.checkInput.bind(this))
      );
    } else {
      // Il ne faut pas ajouter les listeners si la deuxième fenêtre a déjà été générée. Par contre, il faut revérifier les inputs.
      this.checkInput.call(this);
    }
  }

  renderProjectCategory(cat, idx) {
    // les valeurs des options doivent être > 0
    const markup = `
      <option value=${idx + 1}>${cat}</option>
    `;
    this.selectCategory.insertAdjacentHTML("beforeend", markup);
  }

  renderNavigateBack() {
    this.clearErrorMessage();
    this.title.textContent = "Galerie photo";

    this.back.style.visibility = "hidden";
    this.imageList.style.display = "grid";
    this.fieldsAddForm.style.display = "none";
    this.buttonNext.style.display = "block";
    this.buttonValidate.classList.add("hidden");
  }

  readImageFile() {
    const file = this.file.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    try {
      // l'évènement "load" est déclenché après une lecture réussie du fichier par la méthode readAsDataURL
      // la propriété result contient les données sous la forme d'une URL de données
      reader.addEventListener("load", () => {
        this.uploadElement.innerHTML = "";
        this.uploadElement.insertAdjacentHTML(
          "beforeend",
          `<img src=${reader.result} alt="preview" />`
        );
      });
    } catch (err) {
      console.error(err.message);
    }
  }

  getFormData() {
    // créer un objet formData qu'on pourra mettre dans le body de notre requête POST
    const formData = new FormData(this.form);
    formData.append("image", this.file.files[0]);
    return formData;
  }

  checkInput() {
    // vérifier si tous les champs sont remplis
    const allFieldsCompleted = Array.from(
      this.form.querySelectorAll(".field")
    ).every((field) => field.value);

    // enlever/ajouter l'attribut "disabled"
    allFieldsCompleted
      ? this.buttonValidate.removeAttribute("disabled")
      : this.buttonValidate.setAttribute("disabled", "");
  }

  renderError(errorMessage = this.errorMessage) {
    const markup = `<p class="error-message">${errorMessage}</p`;
    this.back.insertAdjacentHTML("afterend", markup);
  }

  //////////////////////////////////////////

  addHandlerRenderNavigateBack(handler) {
    this.back.addEventListener("click", handler);
  }

  addHandlerAddProject(handler) {
    this.buttonValidate.addEventListener("click", handler);
  }

  addHandlerReadImageFile(handler) {
    this.file.addEventListener("change", handler);
  }
}

export default new ModalView();
