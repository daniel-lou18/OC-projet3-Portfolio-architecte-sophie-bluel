class UserView {
  constructor() {
    this.topbar = document.querySelector("#topbar");
    this.loginLink = document.querySelector(".login-link");
    this.logoutLink = document.querySelector(".logout-link");
    this.filtersList = document.querySelector(".filters");
    this.modifyLink = document.querySelector(".modify");
    this.projectsTitle = document.querySelector(".projects-title");
  }

  renderLoggedIn() {
    this.topbar.classList.remove("hidden");
    this.modifyLink.classList.remove("hidden");
    this.projectsTitle.classList.add("margin-bottom");
    this.loginLink.classList.add("hidden");
    this.logoutLink.classList.remove("hidden");
    this.filtersList.remove();
  }

  renderLoggedOut() {
    this.topbar.classList.add("hidden");
    this.loginLink.classList.remove("hidden");
    this.logoutLink.classList.add("hidden");
  }

  addHandlerRenderLoggedIn(handler) {
    document.addEventListener("DOMContentLoaded", handler);
  }

  addHandlerRenderLoggedOut(handler) {
    this.logoutLink.addEventListener("click", handler);
  }
}

export default new UserView();
