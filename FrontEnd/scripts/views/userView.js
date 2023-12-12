class UserView {
  constructor() {
    this.topbar = document.querySelector("#topbar");
    this.loginLink = document.querySelector(".login-link");
  }

  renderLoggedIn() {
    this.topbar.classList.remove("hidden");
    this.loginLink.textContent = "logout";
    this.loginLink.href = "index.html";
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
