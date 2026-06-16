import { describe, expect, it } from "vitest";

import {
  ProjectNotFoundError,
  ProjectsService
} from "../../src/application/projects-service.js";
import type { Project } from "../../src/domain/project.js";
import type { ProjectRepository } from "../../src/ports/project-repository.js";

const projects: Project[] = [
  {
    id: "alpha",
    name: "Alpha",
    path: "/workspace/alpha",
    gitOriginUrl: "git@example.com:alpha.git"
  },
  {
    id: "beta",
    name: "Beta",
    path: "/workspace/beta"
  }
];

function createRepository(): ProjectRepository {
  return {
    async list() {
      return projects;
    },
    async findById(projectId) {
      return projects.find((project) => project.id === projectId);
    }
  };
}

describe("ProjectsService", () => {
  it("lists registered projects", async () => {
    const service = new ProjectsService(createRepository());

    await expect(service.listProjects()).resolves.toEqual(projects);
  });

  it("returns a project by id", async () => {
    const service = new ProjectsService(createRepository());

    await expect(service.getProjectById("alpha")).resolves.toEqual(projects[0]);
  });

  it("throws a domain error when a project is missing", async () => {
    const service = new ProjectsService(createRepository());

    await expect(service.getProjectById("missing")).rejects.toBeInstanceOf(
      ProjectNotFoundError
    );
  });
});
