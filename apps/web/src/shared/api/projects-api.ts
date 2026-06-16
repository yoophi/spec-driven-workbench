import { ApiError, type ApiErrorResponse, toApiErrorCode } from "./api-error";
import type { Project } from "@/entities/project/model";

export type ProjectsApi = {
  listProjects(): Promise<Project[]>;
  getProjectById(projectId: string): Promise<Project>;
};

const DEFAULT_API_BASE_URL = "http://127.0.0.1:3000";

export function getApiBaseUrl() {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  return configuredBaseUrl && configuredBaseUrl.length > 0
    ? configuredBaseUrl
    : DEFAULT_API_BASE_URL;
}

async function readError(response: Response, fallbackMessage: string) {
  try {
    const body = (await response.json()) as ApiErrorResponse;

    return new ApiError(
      toApiErrorCode(body.error?.code),
      body.error?.message ?? fallbackMessage,
      response.status
    );
  } catch {
    return new ApiError("UNKNOWN", fallbackMessage, response.status);
  }
}

export function createProjectsApi(
  apiBaseUrl = getApiBaseUrl(),
  fetcher: typeof fetch = fetch
): ProjectsApi {
  return {
    async listProjects() {
      const response = await fetcher(`${apiBaseUrl}/projects`);

      if (!response.ok) {
        throw await readError(
          response,
          "등록된 프로젝트 목록을 불러올 수 없습니다."
        );
      }

      const body = (await response.json()) as { projects?: Project[] };

      return Array.isArray(body.projects) ? body.projects : [];
    },

    async getProjectById(projectId) {
      const response = await fetcher(`${apiBaseUrl}/projects/${projectId}`);

      if (!response.ok) {
        throw await readError(response, "프로젝트 상세정보를 불러올 수 없습니다.");
      }

      const body = (await response.json()) as { project?: Project };

      if (!body.project) {
        throw new ApiError("UNKNOWN", "프로젝트 상세정보를 불러올 수 없습니다.");
      }

      return body.project;
    }
  };
}
