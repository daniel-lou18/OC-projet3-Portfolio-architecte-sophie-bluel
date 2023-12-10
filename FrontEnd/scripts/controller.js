import { state, loadProjects } from "./model.js";
import GalleryView from "./galleryView.js";

export async function galleryController() {
  await loadProjects();
  state.projects.forEach((project) => GalleryView.renderProject(project));
}

GalleryView.addHandlerRenderProjects(galleryController);

export default GalleryView;
