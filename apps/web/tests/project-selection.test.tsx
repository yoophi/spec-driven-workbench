import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ProjectWorkbench } from "@/widgets/project-workbench/project-workbench";
import { ApiError } from "@/shared/api/api-error";
import type { ProjectsApi } from "@/shared/api/projects-api";

const projects = [
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

function createApi(overrides: Partial<ProjectsApi> = {}): ProjectsApi {
  return {
    getProjectById: vi.fn(async (projectId: string) => {
      const project = projects.find((item) => item.id === projectId);

      if (!project) {
        throw new ApiError(
          "PROJECT_NOT_FOUND",
          "선택한 프로젝트를 찾을 수 없습니다.",
          404
        );
      }

      return project;
    }),
    listProjects: vi.fn(async () => projects),
    ...overrides
  };
}

describe("ProjectWorkbench", () => {
  it("renders the project list and allows selecting a project", async () => {
    const user = userEvent.setup();
    const api = createApi();

    render(<ProjectWorkbench api={api} />);

    expect(screen.getByLabelText("프로젝트 목록 로딩 중")).toBeInTheDocument();
    expect(await screen.findByRole("button", { name: /Alpha/ })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Alpha/ }));

    expect(screen.getByRole("button", { name: /Alpha/ })).toHaveAttribute(
      "aria-pressed",
      "true"
    );
  });

  it("shows selected project detail and updates it when selection changes", async () => {
    const user = userEvent.setup();
    const api = createApi();

    render(<ProjectWorkbench api={api} />);

    await user.click(await screen.findByRole("button", { name: /Alpha/ }));

    const detailRegion = screen.getByText("선택한 실행 대상 프로젝트입니다.")
      .parentElement?.parentElement;
    expect(detailRegion).toBeTruthy();
    expect(screen.getByText("git@example.com:alpha.git")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Beta/ }));

    await waitFor(() => {
      expect(screen.getAllByText("/workspace/beta").length).toBeGreaterThan(1);
    });
    expect(screen.getAllByText("값 없음").length).toBeGreaterThan(0);
  });

  it("shows empty state when no projects are registered", async () => {
    render(<ProjectWorkbench api={createApi({ listProjects: vi.fn(async () => []) })} />);

    expect(await screen.findByText("등록된 프로젝트가 없습니다")).toBeInTheDocument();
  });

  it("shows list error and retries loading projects", async () => {
    const user = userEvent.setup();
    const listProjects = vi
      .fn()
      .mockRejectedValueOnce(
        new ApiError(
          "PROJECT_CATALOG_UNAVAILABLE",
          "등록된 프로젝트 목록을 불러올 수 없습니다.",
          500
        )
      )
      .mockResolvedValueOnce(projects);
    const api = createApi({ listProjects });

    render(<ProjectWorkbench api={api} />);

    expect(
      await screen.findByText("프로젝트 목록을 불러오지 못했습니다")
    ).toBeInTheDocument();

    const alert = screen.getByRole("alert");
    await user.click(within(alert).getByRole("button", { name: "다시 시도" }));

    expect(await screen.findByRole("button", { name: /Alpha/ })).toBeInTheDocument();
    expect(listProjects).toHaveBeenCalledTimes(2);
  });

  it("shows detail missing state when selected project disappears", async () => {
    const user = userEvent.setup();
    const api = createApi({
      getProjectById: vi.fn(async () => {
        throw new ApiError(
          "PROJECT_NOT_FOUND",
          "선택한 프로젝트를 찾을 수 없습니다.",
          404
        );
      })
    });

    render(<ProjectWorkbench api={api} />);

    await user.click(await screen.findByRole("button", { name: /Alpha/ }));

    expect(
      await screen.findByText("선택한 프로젝트를 찾을 수 없습니다")
    ).toBeInTheDocument();
    expect(screen.getByText("최신 목록에서 프로젝트를 다시 선택하세요.")).toBeInTheDocument();
  });

  it("does not reload projects after state updates when using the default API", async () => {
    const originalFetch = globalThis.fetch;
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);

      if (url.endsWith("/projects")) {
        return new Response(JSON.stringify({ projects }), {
          headers: { "Content-Type": "application/json" },
          status: 200
        });
      }

      return new Response(null, { status: 404 });
    });

    globalThis.fetch = fetchMock as typeof fetch;

    try {
      render(<ProjectWorkbench />);

      expect(await screen.findByRole("button", { name: /Alpha/ })).toBeInTheDocument();
      await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    } finally {
      globalThis.fetch = originalFetch;
    }
  });
});
