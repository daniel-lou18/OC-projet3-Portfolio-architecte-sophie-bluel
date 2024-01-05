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
    GalleryView.renderProjects(state.projects);
  } catch (err) {
    GalleryView.renderGalleryError(err.message);
  }
}

async function categoriesController() {
  try {
    await loadCategories();
    // convertir Set en liste car la méthode forEach pour les objets Set ne permet pas d'utiliser le 2ème paramètre index
    GalleryView.renderCategories(Array.from(state.categories));
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
  GalleryView.renderProjects(filteredProjects);
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
  if (!state.user) return;
  UserView.renderLoggedIn();
}

// fonction qui gère la première fenêtre de la modale
async function modalController(e) {
  try {
    // "?" car cela permet d'appeller la fonction modalController sans fournir de paramètre
    e?.preventDefault();
    await loadProjects();
    ModalView.renderModal();
    ModalView.renderProjects(state.projects);
    // Attacher le controller aux images (fonctionnalité suppression)
    ModalView.addHandlerDeleteProject(deleteController);
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

function updateGallery() {
  // Recharger les images sur la page principale en arrière plan
  GalleryView.clearProjects();
  GalleryView.renderProjects(state.projects);
}

async function deleteController(id) {
  try {
    ModalView.clearMessages();
    await deleteProject(id);
    // Recharger les images dans la modale
    await modalController();
    updateGallery();
    ModalView.renderSucces("L'image a été supprimée de la galerie");
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

// fonction qui gère la deuxième fenêtre de la modale
function formController(e) {
  e.preventDefault();
  ModalView.renderForm();
  if (!ModalView.addFormRendered) {
    /// Pour éviter d'ajouter les catégories au menu select quand on revient en arrière et on clique de nouveau sur le bouton "Ajouter une photo"
    ModalView.renderProjectCategories(Array.from(state.categories));
    ModalView.addFormRendered = true;
  }
}

function inputController() {
  ModalView.checkAllInputs();
}

function imageFileController() {
  ModalView.readImageFile();
}

function closeButtonController() {
  ModalView.closeModal();
  ModalView.renderNavigateBack();
}

function outsideClickController(e) {
  if (!ModalView.isOutsideClick(e)) return;
  ModalView.closeModal();
  ModalView.renderNavigateBack();
}

async function navigateBackController(e) {
  e.preventDefault();
  ModalView.renderNavigateBack();
  // Recharger les images dans la modale
  await modalController();
}

async function addProjectController(e) {
  try {
    e.preventDefault();
    const formData = ModalView.getFormData();
    await addProject(formData);
    await navigateBackController(e);
    ModalView.renderSucces("L'image a été ajoutée à la galerie");
    updateGallery();
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

// Connecter les controllers aux eventlisteners des views :
// les méthodes 'addHandler" sont les publishers alors que les controllers (fonctions de rappel) sont les subscribers

function initHomePage() {
  GalleryView.addHandlerRenderProjects(galleryController);
  GalleryView.addHandlerRenderCategories(categoriesController);
  GalleryView.addHandlerFilterProjects(filterController);
  UserView.addHandlerRenderLoggedIn(userController);
  UserView.addHandlerRenderLoggedOut(logoutController);
  ModalView.addHandlerRenderModal(modalController);
  ModalView.addHandlerRenderForm(formController);
  ModalView.addHandlerCheckInputs(inputController);
  ModalView.addHandlerImageFile(imageFileController);
  ModalView.addHandlerCloseButton(closeButtonController);
  ModalView.addHandlerOutsideClick(outsideClickController);
  ModalView.addHandlerRenderNavigateBack(navigateBackController);
  ModalView.addHandlerAddProject(addProjectController);
}

function initLoginPage() {
  LoginView.addHandlerLogin(loginController);
}

export { initHomePage, initLoginPage };
