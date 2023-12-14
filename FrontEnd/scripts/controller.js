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
    state.categories.forEach((cat) => GalleryView.renderCategory(cat));
  } catch (err) {
    GalleryView.renderCategoriesError(err.message);
  }
}

async function filterController() {
  const hashValue = window.location.hash;
  if (!hashValue || !hashValue.startsWith("#filter")) return;
  const filterValue = hashValue.split("-")[1].replaceAll("%20", " ");
  GalleryView.clearProjects();
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
  if (!state.user) return;
  UserView.renderLoggedIn();
  UserView.addHandlerRenderLoggedOut(logoutController);
  ModalView.addHandlerRenderModal(modalController);
}

async function modalController(e) {
  try {
    e?.preventDefault();
    await loadProjects();
    ModalView.renderModal(state.projects);
    ModalView.addHandlerDeleteProject((id) => deleteController(id));
    ModalView.addHandlerRenderAddForm(addFormController);
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

async function deleteController(id) {
  try {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette photo ?")) return;
    await deleteProject(id);
    await modalController();
    GalleryView.clearProjects();
    state.projects.forEach((project) => GalleryView.renderProject(project));
  } catch (err) {
    ModalView.renderError(err.message);
  }
}

function addFormController(e) {
  e.preventDefault();
  ModalView.renderAddForm(Array.from(state.categories));
  ModalView.addHandlerRenderNavigateBack(navigateBackController);
  ModalView.addHandlerAddProject(addProjectController);
  ModalView.addHandlerReadImageFile(addImageController);
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
    console.log(formData);
    await addProject(formData);
    ModalView.closeModal();
  } catch (err) {
    ModalView.renderError(err.message);
  }
  // finally {
  //   // await loadProjects();
  //   ModalView.closeModal();
  // }
}

function addImageController() {
  ModalView.readImageFile();
}

GalleryView.addHandlerRenderProjects(galleryController);
GalleryView.addHandlerRenderCategories(categoriesController);
GalleryView.addHandlerFilterProjects(filterController);
UserView.addHandlerRenderLoggedIn(userController);
LoginView.addHandlerLogin(loginController);

console.log(state);

export { GalleryView, UserView, LoginView, ModalView };
