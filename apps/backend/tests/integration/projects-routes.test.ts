import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { createApp } from "../../src/app.js";

let tempDir: string;
let catalogPath: string;

async function writeCatalog(content: unknown) {
  await writeFile(catalogPath, JSON.stringify(content), "utf8");
}

beforeEach(async () => {
  tempDir = await mkdtemp(join(tmpdir(), "projects-routes-"));
  catalogPath = join(tempDir, "projects.json");
});

afterEach(async () => {
  await rm(tempDir, { force: true, recursive: true });
});

describe("projects routes", () => {
  it("returns registered projects", async () => {
    await writeCatalog({
      projects: [
        {
          id: "alpha",
          name: "Alpha",
          path: "/workspace/alpha",
          gitOriginUrl: "git@example.com:alpha.git"
        }
      ]
    });

    const response = await createApp(catalogPath).request("/projects");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      projects: [
        {
          id: "alpha",
          name: "Alpha",
          path: "/workspace/alpha",
          gitOriginUrl: "git@example.com:alpha.git"
        }
      ]
    });
  });

  it("returns an empty project list", async () => {
    await writeCatalog({ projects: [] });

    const response = await createApp(catalogPath).request("/projects");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ projects: [] });
  });

  it("returns project detail", async () => {
    await writeCatalog({
      projects: [
        {
          id: "alpha",
          name: "Alpha",
          path: "/workspace/alpha"
        }
      ]
    });

    const response = await createApp(catalogPath).request("/projects/alpha");

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      project: {
        id: "alpha",
        name: "Alpha",
        path: "/workspace/alpha"
      }
    });
  });

  it("returns not found for missing project detail", async () => {
    await writeCatalog({ projects: [] });

    const response = await createApp(catalogPath).request("/projects/missing");

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "PROJECT_NOT_FOUND",
        message: "선택한 프로젝트를 찾을 수 없습니다."
      }
    });
  });

  it("returns catalog unavailable for invalid catalog list requests", async () => {
    await writeFile(catalogPath, "{", "utf8");

    const response = await createApp(catalogPath).request("/projects");

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "PROJECT_CATALOG_UNAVAILABLE",
        message: "등록된 프로젝트 목록을 불러올 수 없습니다."
      }
    });
  });

  it("returns catalog unavailable for invalid catalog detail requests", async () => {
    await writeCatalog({ projects: [{ id: "", name: "Broken", path: "" }] });

    const response = await createApp(catalogPath).request("/projects/alpha");

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: "PROJECT_CATALOG_UNAVAILABLE",
        message: "프로젝트 상세정보를 불러올 수 없습니다."
      }
    });
  });
});
