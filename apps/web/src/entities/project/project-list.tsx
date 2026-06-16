import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import type { Project } from "./model";

type ProjectListProps = {
  projects: Project[];
  selectedProjectId?: string;
  onSelect(projectId: string): void;
};

export function ProjectList({
  projects,
  selectedProjectId,
  onSelect
}: ProjectListProps) {
  return (
    <ul aria-label="등록 프로젝트 목록" className="flex flex-col gap-2">
      {projects.map((project) => {
        const selected = project.id === selectedProjectId;

        return (
          <li key={project.id}>
            <Button
              type="button"
              variant={selected ? "secondary" : "outline"}
              className="h-auto w-full justify-start px-3 py-3 text-left"
              aria-pressed={selected}
              onClick={() => onSelect(project.id)}
            >
              <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="flex min-w-0 items-center gap-2">
                  <span className="truncate font-medium">{project.name}</span>
                  {selected ? <Badge variant="secondary">선택됨</Badge> : null}
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  {project.path}
                </span>
              </span>
            </Button>
          </li>
        );
      })}
    </ul>
  );
}
