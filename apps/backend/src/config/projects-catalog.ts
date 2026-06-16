import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const defaultCatalogPath = resolve(currentDir, "../../data/projects.json");

export function getProjectsCatalogPath() {
  return process.env.PROJECTS_CATALOG_PATH ?? defaultCatalogPath;
}
