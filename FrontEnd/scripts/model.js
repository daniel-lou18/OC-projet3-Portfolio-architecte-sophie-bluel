const BASE_URL = "http://localhost:5678/api";

export const state = {
  projects: [],
};

export async function loadProjects() {
  try {
    const res = await fetch(`${BASE_URL}/works`);
    if (!res.ok) throw new Error("Could not get projects");
    const data = await res.json();
    console.log(data);
    state.projects = [...data];
  } catch (err) {
    console.error(err);
  }
}
