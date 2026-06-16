import { useCallback, useEffect, useMemo, useState } from "react";

import { ApiError } from "@/shared/api/api-error";
import { createProjectsApi, type ProjectsApi } from "@/shared/api/projects-api";
import type { Project } from "@/entities/project/model";

type ListStatus = "idle" | "loading" | "success" | "empty" | "error";
type DetailStatus = "idle" | "loading" | "success" | "missing" | "error";

export type ProjectSelectionState = {
  listStatus: ListStatus;
  detailStatus: DetailStatus;
  projects: Project[];
  selectedProjectId?: string;
  selectedProject?: Project;
  errorMessage?: string;
};

const initialState: ProjectSelectionState = {
  listStatus: "idle",
  detailStatus: "idle",
  projects: []
};

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useProjectSelection(api?: ProjectsApi) {
  const [state, setState] = useState<ProjectSelectionState>(initialState);
  const projectsApi = useMemo(() => api ?? createProjectsApi(), [api]);

  const loadProjects = useCallback(async () => {
    setState((current) => ({
      ...current,
      errorMessage: undefined,
      listStatus: "loading"
    }));

    try {
      const projects = await projectsApi.listProjects();

      setState({
        detailStatus: "idle",
        listStatus: projects.length > 0 ? "success" : "empty",
        projects
      });
    } catch (error) {
      setState({
        detailStatus: "idle",
        errorMessage: getErrorMessage(
          error,
          "등록된 프로젝트 목록을 불러올 수 없습니다."
        ),
        listStatus: "error",
        projects: []
      });
    }
  }, [projectsApi]);

  const selectProject = useCallback(
    async (projectId: string) => {
      setState((current) => ({
        ...current,
        detailStatus: "loading",
        errorMessage: undefined,
        selectedProject: undefined,
        selectedProjectId: projectId
      }));

      try {
        const project = await projectsApi.getProjectById(projectId);

        setState((current) => ({
          ...current,
          detailStatus: "success",
          selectedProject: project,
          selectedProjectId: project.id
        }));
      } catch (error) {
        if (error instanceof ApiError && error.code === "PROJECT_NOT_FOUND") {
          setState((current) => ({
            ...current,
            detailStatus: "missing",
            errorMessage: error.message,
            selectedProject: undefined,
            selectedProjectId: undefined
          }));
          return;
        }

        setState((current) => ({
          ...current,
          detailStatus: "error",
          errorMessage: getErrorMessage(
            error,
            "프로젝트 상세정보를 불러올 수 없습니다."
          ),
          selectedProject: undefined
        }));
      }
    },
    [projectsApi]
  );

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  return useMemo(
    () => ({
      loadProjects,
      selectProject,
      state
    }),
    [loadProjects, selectProject, state]
  );
}
