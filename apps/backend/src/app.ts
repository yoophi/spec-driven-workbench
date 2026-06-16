import { Hono } from "hono";
import { cors } from "hono/cors";

import { createProjectsRoutes } from "./adapters/inbound/http/projects-routes.js";
import { FileProjectRepository } from "./adapters/outbound/file-project-repository.js";
import { ProjectsService } from "./application/projects-service.js";
import { getProjectsCatalogPath } from "./config/projects-catalog.js";

export function createApp(catalogPath = getProjectsCatalogPath()) {
  const app = new Hono();
  const projectRepository = new FileProjectRepository(catalogPath);
  const projectsService = new ProjectsService(projectRepository);

  app.use("*", cors());

  app.get("/health", (context) =>
    context.json({
      status: "ok",
      service: "backend"
    })
  );

  app.route("/projects", createProjectsRoutes(projectsService));

  return app;
}
