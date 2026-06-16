import { AlertCircle, FolderOpen, RefreshCcw } from "lucide-react";

import { ProjectDetail } from "@/entities/project/project-detail";
import { ProjectList } from "@/entities/project/project-list";
import { useProjectSelection } from "@/features/project-selection/use-project-selection";
import type { ProjectsApi } from "@/shared/api/projects-api";
import { Alert, AlertDescription, AlertTitle } from "@/shared/ui/alert";
import { Button } from "@/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle
} from "@/shared/ui/empty";
import { Skeleton } from "@/shared/ui/skeleton";

type ProjectWorkbenchProps = {
  api?: ProjectsApi;
};

function LoadingList() {
  return (
    <div aria-label="프로젝트 목록 로딩 중" className="flex flex-col gap-2">
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
      <Skeleton className="h-14 w-full" />
    </div>
  );
}

export function ProjectWorkbench({ api }: ProjectWorkbenchProps) {
  const { loadProjects, selectProject, state } = useProjectSelection(api);
  const hasDetailError =
    state.detailStatus === "error" || state.detailStatus === "missing";
  const retryProjectId = state.selectedProjectId;

  return (
    <main className="min-h-screen bg-background px-5 py-8 text-foreground md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">
            Spec Driven Workbench
          </p>
          <h1 className="text-3xl font-semibold tracking-normal">
            프로젝트 선택
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            등록된 프로젝트를 선택하고 실행 대상의 이름, path, git origin url을
            확인합니다.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[minmax(280px,380px)_1fr]">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-base font-medium">등록 프로젝트</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadProjects()}
              >
                <RefreshCcw data-icon="inline-start" />
                다시 시도
              </Button>
            </div>

            {state.listStatus === "loading" ? <LoadingList /> : null}

            {state.listStatus === "success" ? (
              <ProjectList
                projects={state.projects}
                selectedProjectId={state.selectedProjectId}
                onSelect={(projectId) => void selectProject(projectId)}
              />
            ) : null}

            {state.listStatus === "empty" ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <FolderOpen aria-hidden="true" />
                  </EmptyMedia>
                  <EmptyTitle>등록된 프로젝트가 없습니다</EmptyTitle>
                  <EmptyDescription>
                    백엔드 catalog JSON 파일에 프로젝트를 등록한 뒤 다시 시도하세요.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : null}

            {state.listStatus === "error" ? (
              <Alert variant="destructive">
                <AlertCircle aria-hidden="true" />
                <AlertTitle>프로젝트 목록을 불러오지 못했습니다</AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col gap-3">
                    <p>{state.errorMessage}</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => void loadProjects()}
                    >
                      <RefreshCcw data-icon="inline-start" />
                      다시 시도
                    </Button>
                  </div>
                </AlertDescription>
              </Alert>
            ) : null}
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-base font-medium">상세정보</h2>

            {hasDetailError ? (
              <Alert variant="destructive">
                <AlertCircle aria-hidden="true" />
                <AlertTitle>
                  {state.detailStatus === "missing"
                    ? "선택한 프로젝트를 찾을 수 없습니다"
                    : "상세정보를 불러오지 못했습니다"}
                </AlertTitle>
                <AlertDescription>
                  <div className="flex flex-col gap-3">
                    <p>{state.errorMessage}</p>
                    {retryProjectId ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => void selectProject(retryProjectId)}
                      >
                        <RefreshCcw data-icon="inline-start" />
                        다시 시도
                      </Button>
                    ) : (
                      <EmptyContent>
                        최신 목록에서 프로젝트를 다시 선택하세요.
                      </EmptyContent>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            ) : (
              <ProjectDetail
                project={state.selectedProject}
                status={state.detailStatus}
              />
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
