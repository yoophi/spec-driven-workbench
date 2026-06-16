import type { ProjectRepository } from "../ports/project-repository.js";

export class ProjectNotFoundError extends Error {
  constructor(readonly projectId: string) {
    super(`Project ${projectId} was not found`);
    this.name = "ProjectNotFoundError";
  }
}

export class ProjectsService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  async listProjects() {
    return this.projectRepository.list();
  }

  async getProjectById(projectId: string) {
    const project = await this.projectRepository.findById(projectId);

    if (!project) {
      throw new ProjectNotFoundError(projectId);
    }

    return project;
  }
}
