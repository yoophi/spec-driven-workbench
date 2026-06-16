import { Hono } from "hono";

import {
  ProjectNotFoundError,
  type ProjectsService
} from "../../../application/projects-service.js";
import { ProjectCatalogUnavailableError } from "../../outbound/file-project-repository.js";

export function createProjectsRoutes(projectsService: ProjectsService) {
  const routes = new Hono();

  routes.get("/", async (context) => {
    try {
      const projects = await projectsService.listProjects();

      return context.json({ projects });
    } catch (error) {
      if (error instanceof ProjectCatalogUnavailableError) {
        return context.json(
          {
            error: {
              code: "PROJECT_CATALOG_UNAVAILABLE",
              message: "등록된 프로젝트 목록을 불러올 수 없습니다."
            }
          },
          500
        );
      }

      throw error;
    }
  });

  routes.get("/:projectId", async (context) => {
    try {
      const project = await projectsService.getProjectById(
        context.req.param("projectId")
      );

      return context.json({ project });
    } catch (error) {
      if (error instanceof ProjectNotFoundError) {
        return context.json(
          {
            error: {
              code: "PROJECT_NOT_FOUND",
              message: "선택한 프로젝트를 찾을 수 없습니다."
            }
          },
          404
        );
      }

      if (error instanceof ProjectCatalogUnavailableError) {
        return context.json(
          {
            error: {
              code: "PROJECT_CATALOG_UNAVAILABLE",
              message: "프로젝트 상세정보를 불러올 수 없습니다."
            }
          },
          500
        );
      }

      throw error;
    }
  });

  return routes;
}
