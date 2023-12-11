import {
  state,
  loadProjects,
  loadCategories,
  getFilteredProjects,
  login,
} from "./model.js";
import GalleryView from "./views/galleryView.js";
import LoginView from "./views/loginView.js";

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
  } catch (err) {
    LoginView.renderError(err.message);
  }
}

GalleryView.addHandlerRenderProjects(galleryController);
GalleryView.addHandlerRenderCategories(categoriesController);
GalleryView.addHandlerFilterProjects(filterController);
LoginView.addHandlerLogin(loginController);

export { GalleryView, LoginView };
