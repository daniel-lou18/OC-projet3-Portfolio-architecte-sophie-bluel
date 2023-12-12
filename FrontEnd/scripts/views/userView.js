class UserView {
  constructor() {
    this.topbar = document.querySelector("#topbar");
    this.loginLink = document.querySelector(".login-link");
    this.filtersList = document.querySelector(".filters");
    this.modifyLink = document.querySelector(".modify");
    this.projectsTitle = document.querySelector(".projects-title");
  }

  renderLoggedIn() {
    this.topbar.classList.remove("hidden");
    this.modifyLink.classList.remove("hidden");
    this.projectsTitle.classList.add("margin-bottom");
    this.loginLink.textContent = "logout";
    this.loginLink.href = "index.html";
    this.filtersList.remove();
  }

  renderLoggedOut() {
    this.topbar.classList.add("hidden");
    this.loginLink.textContent = "login";
  }

  addHandlerRenderLoggedIn(handler) {
    window.addEventListener("load", handler);
  }

  addHandlerRenderLoggedOut(handler) {
    this.loginLink.addEventListener("click", handler);
  }
}

export default new UserView();
