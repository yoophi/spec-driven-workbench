import { readFile } from "node:fs/promises";

import {
  parseProjectCatalog,
  ProjectCatalogValidationError,
  type Project
} from "../../domain/project.js";
import type { ProjectRepository } from "../../ports/project-repository.js";

export class ProjectCatalogUnavailableError extends Error {
  constructor(cause: unknown) {
    super("Project catalog is unavailable", { cause });
    this.name = "ProjectCatalogUnavailableError";
  }
}

export class FileProjectRepository implements ProjectRepository {
  constructor(private readonly catalogPath: string) {}

  async list() {
    return this.readCatalog();
  }

  async findById(projectId: string) {
    const projects = await this.readCatalog();

    return projects.find((project) => project.id === projectId);
  }

  private async readCatalog(): Promise<Project[]> {
    try {
      const file = await readFile(this.catalogPath, "utf8");
      const catalog = parseProjectCatalog(JSON.parse(file));

      return catalog.projects;
    } catch (error) {
      if (error instanceof ProjectCatalogValidationError) {
        throw new ProjectCatalogUnavailableError(error);
      }

      throw new ProjectCatalogUnavailableError(error);
    }
  }
}
