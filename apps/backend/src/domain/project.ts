export type Project = {
  id: string;
  name: string;
  path: string;
  gitOriginUrl?: string;
};

export type ProjectCatalog = {
  projects: Project[];
};

export class ProjectCatalogValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProjectCatalogValidationError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(
  source: Record<string, unknown>,
  field: string,
  index: number
) {
  const value = source[field];

  if (typeof value !== "string" || value.trim().length === 0) {
    throw new ProjectCatalogValidationError(
      `projects[${index}].${field} must be a non-empty string`
    );
  }

  return value.trim();
}

export function parseProjectCatalog(value: unknown): ProjectCatalog {
  if (!isRecord(value) || !Array.isArray(value.projects)) {
    throw new ProjectCatalogValidationError("projects must be an array");
  }

  const seenIds = new Set<string>();
  const projects = value.projects.map((project, index) => {
    if (!isRecord(project)) {
      throw new ProjectCatalogValidationError(
        `projects[${index}] must be an object`
      );
    }

    const parsed: Project = {
      id: readString(project, "id", index),
      name: readString(project, "name", index),
      path: readString(project, "path", index)
    };

    if (seenIds.has(parsed.id)) {
      throw new ProjectCatalogValidationError(
        `projects[${index}].id must be unique`
      );
    }

    seenIds.add(parsed.id);

    if (typeof project.gitOriginUrl === "string") {
      const gitOriginUrl = project.gitOriginUrl.trim();

      if (gitOriginUrl.length > 0) {
        parsed.gitOriginUrl = gitOriginUrl;
      }
    }

    return parsed;
  });

  return { projects };
}
