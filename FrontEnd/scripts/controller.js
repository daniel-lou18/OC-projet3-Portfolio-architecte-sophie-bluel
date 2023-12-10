import {
  state,
  loadProjects,
  loadCategories,
  getFilteredProjects,
} from "./model.js";
import GalleryView from "./galleryView.js";

async function galleryController() {
  await loadProjects();
  state.projects.forEach((project) => GalleryView.renderProject(project));
}

async function categoriesController() {
  await loadCategories();
  state.categories.forEach((cat) => GalleryView.renderCategory(cat));
}

async function filterController() {
  const filterValue = window.location.hash?.slice(1).replaceAll("%20", " ");
  console.log(filterValue);
  GalleryView.clearProjects();
  if (!filterValue || filterValue === "tous") return await galleryController();
  const filteredProjects = getFilteredProjects(filterValue);
  filteredProjects.forEach((project) => GalleryView.renderProject(project));
}

GalleryView.addHandlerRenderProjects(galleryController);
GalleryView.addHandlerRenderCategories(categoriesController);
GalleryView.addHandlerFilterProjects(filterController);

export default GalleryView;
