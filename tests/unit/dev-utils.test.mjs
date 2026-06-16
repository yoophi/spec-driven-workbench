import assert from "node:assert/strict";
import { createServer } from "node:net";
import { test } from "node:test";

import {
  formatRecoveryHint,
  formatSessionSummary,
  isPortAvailable,
  parseBackendBaseUrl,
  parseFrontendLocalUrl,
  selectBackendPort
} from "../../scripts/dev-utils.mjs";

function listen(server, port = 0, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve(server.address()));
  });
}

function close(server) {
  return new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
}

test("parseBackendBaseUrl extracts the backend listening URL", () => {
  assert.equal(
    parseBackendBaseUrl("backend server listening on http://127.0.0.1:48231"),
    "http://127.0.0.1:48231"
  );
});

test("parseBackendBaseUrl ignores unrelated output", () => {
  assert.equal(parseBackendBaseUrl("vite ready in 123 ms"), null);
});

test("parseFrontendLocalUrl extracts a Vite local URL", () => {
  assert.equal(
    parseFrontendLocalUrl("  Local:   http://127.0.0.1:5174/"),
    "http://127.0.0.1:5174"
  );
});

test("isPortAvailable reports false for an occupied port", async () => {
  const server = createServer();
  const address = await listen(server);

  try {
    assert.equal(await isPortAvailable(address.port), false);
  } finally {
    await close(server);
  }
});

test("selectBackendPort keeps the preferred port when available", async () => {
  const server = createServer();
  const address = await listen(server);
  await close(server);

  const selected = await selectBackendPort({ preferredPort: address.port });

  assert.equal(selected.mode, "preferred");
  assert.equal(selected.port, address.port);
});

test("selectBackendPort requests an OS-assigned port when preferred is occupied", async () => {
  const server = createServer();
  const address = await listen(server);

  try {
    const selected = await selectBackendPort({ preferredPort: address.port });

    assert.equal(selected.mode, "os-assigned");
    assert.equal(selected.port, 0);
    assert.match(selected.reason, /already in use/);
  } finally {
    await close(server);
  }
});

test("formatRecoveryHint includes component, detail, and recovery action", () => {
  const message = formatRecoveryHint("backend", "process exited before readiness");

  assert.match(message, /backend startup failed/);
  assert.match(message, /process exited before readiness/);
  assert.match(message, /Recovery:/);
});

test("formatSessionSummary includes workspace root and both URLs", () => {
  const message = formatSessionSummary({
    workspaceRoot: "/tmp/workbench",
    backendBaseUrl: "http://127.0.0.1:3000",
    frontendUrl: "http://127.0.0.1:5173"
  });

  assert.match(message, /Workspace: \/tmp\/workbench/);
  assert.match(message, /Backend:\s+http:\/\/127\.0\.0\.1:3000/);
  assert.match(message, /Frontend:\s+http:\/\/127\.0\.0\.1:5173/);
});
