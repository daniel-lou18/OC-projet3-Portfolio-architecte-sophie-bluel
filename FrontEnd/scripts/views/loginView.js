class LoginView {
  constructor() {
    this.data = null;
    this.parentElement = document.querySelector("#login form");
    this.errorMessage =
      "Désolé, nous n'avons pas pu vous connecter à votre compte.";
  }

  getUserCredentials() {
    const email = this.parentElement.children[1].value;
    const password = this.parentElement.children[3].value;
    console.log(email, password);
    return { email, password };
  }

  renderError(errorMessage = this.errorMessage) {
    const markup = `<p>${errorMessage}</p`;
    this.parentElement
      .querySelector(".error-message")
      .insertAdjacentHTML("beforeend", markup);
  }

  addHandlerLogin(handler) {
    this.parentElement.addEventListener("submit", handler);
  }
}

export default new LoginView();
