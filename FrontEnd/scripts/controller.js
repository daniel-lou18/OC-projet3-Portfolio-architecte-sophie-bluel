import {
  state,
  loadProjects,
  loadCategories,
  getFilteredProjects,
  login,
  loadUser,
  logoutUser,
  deleteProject,
  addProject,
} from "./model.js";
import GalleryView from "./views/galleryView.js";
import LoginView from "./views/loginView.js";
import UserView from "./views/userView.js";
import ModalView from "./views/modalView.js";
/// On importe à chaque fois une instance de la classe

async function galleryController() {
  try {
    await loadProjects();
    state.projects.forEach((project) => GalleryView.renderProject(project));
  } catch (err) {
    GalleryView.renderGalleryError(err.message);
  }
}

async function categoriesController() {
  try {
    await loadCategories();
    // convertir en liste car la méthode forEach pour les objets Set ne permet pas d'utiliser le 2ème paramètre index
    Array.from(state.categories).forEach((cat, idx) =>
      GalleryView.renderCategory(cat, idx)
    );
  } catch (err) {
    GalleryView.renderCategoriesError(err.message);
  }
}

async function filterController() {
  // Meilleure expérience UX : l'utilisateur peut voir la valeur du filtre dans la barre d'adresse
  const hashValue = window.location.hash;
  if (!hashValue || !hashValue.startsWith("#filter")) return;
  GalleryView.clearProjects();
  // Recharger toutes les images quand l'utilisateur clique sur 'tous'
  if (hashValue.endsWith("-tous")) return await galleryController();
  const filteredProjects = getFilteredProjects(hashValue);
  filteredProjects.forEach((project) => GalleryView.renderProject(project));
}

async function loginController(e) {
  try {
    e.preventDefault();
    const credentials = LoginView.getUserCredentials();
    await login(credentials);
    window.location.assign("index.html");
  } catch (err) {
    LoginView.renderError(err.message);
  }
}

function logoutController() {
  logoutUser();
  window.location.assign("index.html");
  UserView.renderLoggedOut();
}

function userController() {
  loadUser();
  console.log(state.user);
  if (!state.user) return;
  UserView.renderLoggedIn();
}

// fonction qui gère la première fenêtre de la modale
async function modalController(e) {
  try {
    // "?" car cela permet d'appeller la fonction modalController sans fournir de paramètre
    e?.preventDefault();
    await loadProjects();
    // Afficher les images
    ModalView.renderModal(state.projects);
    // Attacher le controller aux images (fonctionnalité suppression)
    ModalView.addHandlerDeleteProject(deleteController);
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

async function deleteController(id) {
  try {
    ModalView.clearMessages();
    await deleteProject(id);
    // Recharger les images dans la modale
    await modalController();
    // Recharger les images sur la page principale en arrière plan
    GalleryView.clearProjects();
    state.projects.forEach((project) => GalleryView.renderProject(project));
    ModalView.renderSucces("L'image a été supprimée de la galerie");
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

// fonction qui gère la deuxième fenêtre de la modale
function addFormController(e) {
  e.preventDefault();
  ModalView.renderAddForm(Array.from(state.categories));
}

async function navigateBackController(e) {
  e.preventDefault();
  ModalView.renderNavigateBack();
  await modalController();
}

async function addProjectController(e) {
  try {
    e.preventDefault();
    const formData = ModalView.getFormData();
    await addProject(formData);
    // Retourner à la première fenêtre de la modale
    ModalView.renderNavigateBack();
    // Recharger les images dans la modale
    await modalController();
    // Recharger les images sur la page principale en arrière plan
    ModalView.renderSucces("L'image a été ajoutée à la galerie");
    GalleryView.clearProjects();
    state.projects.forEach((project) => GalleryView.renderProject(project));
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

// Connecter les controllers aux views : les méthodes 'addHandler" sont les publishers et les controllers (fonctions de rappel) sont les subscribers

function initHomePage() {
  GalleryView.addHandlerRenderProjects(galleryController);
  GalleryView.addHandlerRenderCategories(categoriesController);
  GalleryView.addHandlerFilterProjects(filterController);
  UserView.addHandlerRenderLoggedIn(userController);
  UserView.addHandlerRenderLoggedOut(logoutController);
  ModalView.addHandlerRenderModal(modalController);
  ModalView.addHandlerRenderAddForm(addFormController);
  ModalView.addHandlerRenderNavigateBack(navigateBackController);
  ModalView.addHandlerAddProject(addProjectController);
}

function initLoginPage() {
  LoginView.addHandlerLogin(loginController);
}

export { initHomePage, initLoginPage };
