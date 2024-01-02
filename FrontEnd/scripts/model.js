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
    // Il faut de nouveau faire un throw error si on veut utiliser cette fonction async dans le controller
    //  car la valeur de retour d'une fonction async est une nouvelle promise.
    // Si on ne fait pas de throw la promise sera toujours résolue et on ne pourra pas le réutiliser dans un block try catch
    throw err;
  }
}

export async function loadCategories() {
  try {
    const res = await fetch(`${BASE_URL}/categories`);
    if (!res.ok) throw new Error("🚨 Échec du chargement des catégories");
    const data = await res.json();
    // On nous demande de créer un Set pour les catégories
    state.categories = new Set(
      data.map((cat) => {
        if (cat.name.includes("Hotels"))
          return cat.name.replace("Hotels", "Hôtels");
        return cat.name;
      })
    );
    console.log(state.categories);
  } catch (err) {
    throw err;
  }
}

export function getFilteredProjects(hashValue) {
  try {
    if (state.projects.length === 0 || state.categories.length === 0)
      throw new Error("🚨 Échec lors du filtrage des photos");

    const filterValue = hashValue
      .split("-")[1]
      .replaceAll("%20", " ")
      .replaceAll("%C3%B4", "ô");

    const filteredProjects = state.projects.filter((project) => {
      return (
        project.categoryId - 1 ===
        Array.from(state.categories).indexOf(filterValue)
      );
    });
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
    // Sauvegarder l'adresse mail, mot de passe, token et userId en format JSON dans le localStorage
    localStorage.setItem("user", JSON.stringify({ ...credentials, ...data }));
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}

export function loadUser() {
  // Convertir le JSON en objet et sauvegarder l'objet dans la propriété "user"
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
      headers: {
        Authorization: `Bearer ${state.user.token}`,
      },
    });
    if (res.status === 401)
      throw new Error(
        "🚨 Vous n'avez pas l'autorisation de supprimer cette image. Veuillez vous connecter à votre compte."
      );
    if (!res.ok) throw new Error("🚨 Échec de la suppression de la photo");
    console.log(res);
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
    if (res.status === 400)
      throw new Error(
        "🚨 Échec de l'ajout de la photo. Veillez à bien remplir tous les champs."
      );
    if (res.status === 401)
      throw new Error(
        "🚨 Vous n'avez pas l'autorisation d'ajouter une photo. Veuillez vous connecter à votre compte."
      );
    if (!res.ok)
      throw new Error(
        "🚨 Échec de l'ajout de la photo. Veillez à bien remplir tous les champs."
      );
    const data = await res.json();
    console.log(data);
  } catch (err) {
    console.error(err.message);
    throw err;
  }
}
