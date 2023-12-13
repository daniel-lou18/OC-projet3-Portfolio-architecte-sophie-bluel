const BASE_URL = "http://localhost:5678/api";

export const state = {
  projects: [],
  categories: [],
  user: null,
};

export async function loadProjects() {
  try {
    const res = await fetch(`${BASE_URL}/works`);
    if (!res.ok) throw new Error("🚨 Échec du chargement des projets");
    const data = await res.json();
    state.projects = [...data];
  } catch (err) {
    throw err;
  }
}

export async function loadCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("🚨 Échec du chargement des catégories");
    const data = await res.json();
    state.categories = new Set(data.map((cat) => cat.name));
  } catch (err) {
    throw err;
  }
}

export function getFilteredProjects(filterValue) {
  try {
    if (state.projects.length === 0 || state.categories.length === 0)
      throw new Error("🚨 Échec lors du filtrage des photos");
    const filteredProjects = state.projects.filter(
      (project) =>
        project.categoryId - 1 ===
        Array.from(state.categories).indexOf(filterValue)
    );
    return filteredProjects;
  } catch (err) {
    console.error(err.message);
  }
}

export async function login(credentials) {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });
    if (res.status === 401)
      throw new Error(
        "🚨 Mot de passe ou adresse email invalide. Veuillez bien vérifier la saisie de votre adresse email et de votre mot de passe."
      );
    if (res.status === 404)
      throw new Error(
        "🚨 Compte utilisateur inconnu. Veuillez bien vérifier les données que vous avez saisies."
      );
    if (!res.ok)
      throw new Error("🚨 Erreur lors de la connexion à votre compte.");
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify({ ...credentials, ...data }));
  } catch (err) {
    console.error(err);
    throw err;
  }
}

export function loadUser() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;
  state.user = user;
}

export function logoutUser() {
  localStorage.removeItem("user");
}

export async function deleteProject(id) {
  try {
    const res = await fetch(`${BASE_URL}/works/${id}`, {
      method: "DELETE",
      headers: { Accept: "*/*", Authorization: `Bearer ${state.user.token}` },
    });
    if (!res.ok) throw new Error("Échec de la suppression de la photo");
    const data = await res.json();
    // PROBLEME : SyntaxError: Unexpected end of JSON input !!!
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export async function addProject(formData) {
  try {
    const res = await fetch(`${BASE_URL}/works`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${state.user.token}`,
      },
      body: formData,
    });
    if (!res.ok) throw new Error("Échec de l'ajout de la photo");
    const data = await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
}
