import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { Skeleton } from "@/shared/ui/skeleton";
import { getGitOriginLabel, type Project } from "./model";

type ProjectDetailProps = {
  project?: Project;
  status: "idle" | "loading" | "success" | "missing" | "error";
};

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="break-all text-sm">{value}</dd>
    </div>
  );
}

export function ProjectDetail({ project, status }: ProjectDetailProps) {
  if (status === "loading") {
    return (
      <Card aria-live="polite">
        <CardHeader>
          <CardTitle>상세정보 불러오는 중</CardTitle>
          <CardDescription>선택한 프로젝트 정보를 확인하고 있습니다.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    );
  }

  if (!project) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>프로젝트를 선택하세요</CardTitle>
          <CardDescription>
            목록에서 프로젝트를 선택하면 상세정보가 표시됩니다.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const gitOriginLabel = getGitOriginLabel(project);

  return (
    <Card aria-live="polite">
      <CardHeader>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>선택한 실행 대상 프로젝트입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4">
          <DetailRow label="이름" value={project.name} />
          <DetailRow label="path" value={project.path} />
          <div className="grid gap-1">
            <dt className="text-xs font-medium text-muted-foreground">
              git origin url
            </dt>
            <dd className="flex min-w-0 flex-wrap items-center gap-2 break-all text-sm">
              <span>{gitOriginLabel}</span>
              {!project.gitOriginUrl ? (
                <Badge variant="outline">값 없음</Badge>
              ) : null}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
