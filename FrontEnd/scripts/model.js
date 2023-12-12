const BASE_URL = "http://localhost:5678/api";

export const state = {
  projects: [],
  categories: [],
  user: null,
};

export async function loadProjects() {
  try {
    const res = await fetch(`${BASE_URL}/works`);
    if (!res.ok) throw new Error("Impossible de récupérer les projets");
    const data = await res.json();
    console.log(data);
    state.projects = [...data];
  } catch (err) {
    console.error(err);
  }
}

export async function loadCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("Impossible de récupérer les catégories");
    const data = await res.json();
    state.categories = new Set(data.map((cat) => cat.name));
  } catch (err) {
    console.error(err);
  }
}

export function getFilteredProjects(filterValue) {
  try {
    if (state.projects.length === 0 || state.categories.length === 0)
      throw new Error("Impossible de filtrer les projets");
    const filteredProjects = state.projects.filter(
      (project) =>
        project.categoryId - 1 ===
        Array.from(state.categories).indexOf(filterValue)
    );
    return filteredProjects;
  } catch (err) {
    console.error(err);
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
    if (!res.ok && res.status === 401)
      throw new Error(
        "Mot de passe ou adresse email invalide. Veuillez bien vérifier la saisie de votre adresse email et de votre mot de passe."
      );
    if (!res.ok)
      throw new Error(
        "Désolé, nous n'avons pas pu vous connecter à votre compte."
      );
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
  // PROBLEME : SyntaxError: Unexpected end of JSON input !!!
  try {
    const res = await fetch(`${BASE_URL}/works/${id}`, {
      method: "DELETE",
      headers: { Accept: "*/*", Authorization: `Bearer ${state.user.token}` },
    });
    if (!res.ok) throw new Error("Impossible de supprimer le projet");
    const data = await res.json();
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
