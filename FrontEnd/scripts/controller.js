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
  const filterValue = hashValue
    .split("-")[1]
    .replaceAll("%20", " ")
    .replaceAll("%C3%B4", "ô");
  if (filterValue === "tous") return await galleryController();
  const filteredProjects = getFilteredProjects(filterValue);
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
  UserView.addHandlerRenderLoggedOut(logoutController);
  // Ajouter le controller qui gère la première fenêtre de la modale à l'icône "modifier"
  // (qui est uniquement visible quand l'utilisateur est connecté)
  ModalView.addHandlerRenderModal(modalController);
}

// fonction qui gère la première fenêtre de la modale
async function modalController(e) {
  try {
    // "?" car cela permet d'appeller la fonction modalController sans fournir de paramètre
    e?.preventDefault();
    await loadProjects();
    // Charger les images
    ModalView.renderModal(state.projects);
    // Attacher les controllers aux images (fonctionnalité suppression) et au bouton (pour accéder à la deuxième fenêtre de la modale)
    ModalView.addHandlerDeleteProject(deleteController);
    ModalView.addHandlerRenderAddForm(addFormController);
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

async function deleteController(id) {
  try {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) return;
    await deleteProject(id);
    // Recharger les images dans la modale
    await modalController();
    // Recharger les images sur la page principale en arrière plan
    GalleryView.clearProjects();
    state.projects.forEach((project) => GalleryView.renderProject(project));
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

// fonction qui gère la deuxième fenêtre de la modale
function addFormController(e) {
  e.preventDefault();
  ModalView.renderAddForm(Array.from(state.categories));
  ModalView.addHandlerRenderNavigateBack(navigateBackController);
  ModalView.addHandlerAddProject(addProjectController);
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
    ModalView.closeModal();
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

/////////////////////////////////////////

function initHomePage() {
  GalleryView.addHandlerRenderProjects(galleryController);
  GalleryView.addHandlerRenderCategories(categoriesController);
  GalleryView.addHandlerFilterProjects(filterController);
  UserView.addHandlerRenderLoggedIn(userController);
}

function initLoginPage() {
  LoginView.addHandlerLogin(loginController);
}

export { initHomePage, initLoginPage };
