import type { Project } from "../domain/project.js";

export interface ProjectRepository {
  list(): Promise<Project[]>;
  findById(projectId: string): Promise<Project | undefined>;
}
