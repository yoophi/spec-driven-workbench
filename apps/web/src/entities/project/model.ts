export type Project = {
  id: string;
  name: string;
  path: string;
  gitOriginUrl?: string;
};

export function getGitOriginLabel(project: Project) {
  return project.gitOriginUrl?.trim() || "값 없음";
}
