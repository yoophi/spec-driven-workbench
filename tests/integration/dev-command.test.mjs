import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { test } from "node:test";

function listen(server, port, host = "127.0.0.1") {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => resolve(server.address()));
  });
}

function close(server) {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

function runDev(extraEnv = {}) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, ["scripts/dev.mjs"], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        DEV_EXIT_AFTER_READY: "1",
        DEV_STARTUP_TIMEOUT_MS: "5000",
        ...extraEnv
      },
      stdio: ["ignore", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (chunk) => {
      stdout += chunk;
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });

    child.on("close", (code, signal) => {
      resolve({ code, signal, stdout, stderr });
    });
  });
}

test("root dev command uses an OS-assigned backend port when preferred port is occupied", async () => {
  const occupied = createServer();
  await listen(occupied, 0);
  const occupiedPort = occupied.address().port;

  try {
    const result = await runDev({
      BACKEND_PORT: String(occupiedPort),
      DEV_BACKEND_COMMAND:
        "node -e \"console.log('backend server listening on http://127.0.0.1:43111'); setInterval(() => {}, 1000)\"",
      DEV_FRONTEND_COMMAND:
        "node -e \"console.log('VITE_API_BASE_URL=' + process.env.VITE_API_BASE_URL); console.log('Local: http://127.0.0.1:5179/'); setInterval(() => {}, 1000)\""
    });

    assert.equal(result.code, 0, result.stderr);
    assert.match(result.stdout, new RegExp(`Backend port ${occupiedPort} is in use`));
    assert.match(result.stdout, /Backend ready: http:\/\/127\.0\.0\.1:43111/);
  } finally {
    await close(occupied);
  }
});

test("root dev command passes the actual backend base URL to frontend env", async () => {
  const result = await runDev({
    DEV_BACKEND_COMMAND:
      "node -e \"console.log('backend server listening on http://127.0.0.1:43112'); setInterval(() => {}, 1000)\"",
    DEV_FRONTEND_COMMAND:
      "node -e \"console.log('frontend received ' + process.env.VITE_API_BASE_URL); console.log('Local: http://127.0.0.1:5180/'); setInterval(() => {}, 1000)\""
  });

  assert.equal(result.code, 0, result.stderr);
  assert.match(result.stdout, /frontend received http:\/\/127\.0\.0\.1:43112/);
  assert.match(result.stdout, /Frontend:\s+http:\/\/127\.0\.0\.1:5180/);
});

test("root dev command reports backend startup failure before launching frontend", async () => {
  const result = await runDev({
    DEV_BACKEND_COMMAND: "node -e \"process.exit(23)\"",
    DEV_FRONTEND_COMMAND:
      "node -e \"console.log('frontend should not start'); console.log('Local: http://127.0.0.1:5181/')\""
  });

  assert.equal(result.code, 1);
  assert.match(result.stderr, /backend startup failed/);
  assert.doesNotMatch(result.stdout, /frontend should not start/);
});
