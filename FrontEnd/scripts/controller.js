import {
  state,
  loadProjects,
  loadCategories,
  getFilteredProjects,
  login,
  loadUser,
  logoutUser,
  deleteProject,
} from "./model.js";
import GalleryView from "./views/galleryView.js";
import LoginView from "./views/loginView.js";
import UserView from "./views/userView.js";
import ModalView from "./views/modalView.js";

async function galleryController() {
  await loadProjects();
  state.projects.forEach((project) => GalleryView.renderProject(project));
}

async function categoriesController() {
  await loadCategories();
  state.categories.forEach((cat) => GalleryView.renderCategory(cat));
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
  console.log(state.user);
  if (!state.user) return;
  UserView.renderLoggedIn();
  UserView.addHandlerRenderLoggedOut(logoutController);
  ModalView.addHandlerRenderModal(modalController);
}

async function modalController() {
  if (state.projects.length === 0) await loadProjects();
  ModalView.renderModal(state.projects);
  ModalView.addHandlerDeleteProject((id) => deleteController(id));
}

async function deleteController(id) {
  try {
    await deleteProject(id);
    // PROBLEME : SyntaxError: Unexpected end of JSON input !!!
  } catch (err) {
    console.error(err);
  } finally {
    await loadProjects();
    ModalView.renderModal(state.projects);
  }
}

GalleryView.addHandlerRenderProjects(galleryController);
GalleryView.addHandlerRenderCategories(categoriesController);
GalleryView.addHandlerFilterProjects(filterController);
UserView.addHandlerRenderLoggedIn(userController);
LoginView.addHandlerLogin(loginController);

console.log(state);

export { GalleryView, UserView, LoginView, ModalView };
