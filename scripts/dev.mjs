import process from "node:process";

import {
  DEFAULT_BACKEND_HOST,
  DEFAULT_BACKEND_PORT,
  commandFromEnv,
  formatRecoveryHint,
  formatSessionSummary,
  forwardTerminationSignals,
  parseBackendBaseUrl,
  parseFrontendLocalUrl,
  selectBackendPort,
  spawnManagedProcess,
  terminateChildren,
  waitForReadyLine
} from "./dev-utils.mjs";

const workspaceRoot = process.cwd();
const host = process.env.HOST ?? DEFAULT_BACKEND_HOST;
const preferredPort = Number.parseInt(
  process.env.BACKEND_PORT ?? String(DEFAULT_BACKEND_PORT),
  10
);
const startupTimeoutMs = Number.parseInt(
  process.env.DEV_STARTUP_TIMEOUT_MS ?? "15000",
  10
);

const backendCommand = commandFromEnv(process.env.DEV_BACKEND_COMMAND, {
  command: "pnpm",
  args: ["--filter", "backend", "dev"]
});
const frontendCommand = commandFromEnv(process.env.DEV_FRONTEND_COMMAND, {
  command: "pnpm",
  args: ["--filter", "web", "dev", "--host", host]
});

const children = [];
const cleanupSignalHandlers = forwardTerminationSignals(children, (signal) => {
  console.log(`\nReceived ${signal}; stopping development session...`);
});

async function main() {
  console.log("Starting development session...");
  console.log(`Workspace: ${workspaceRoot}`);

  const backendPort = await selectBackendPort({
    preferredPort,
    host
  });

  if (backendPort.mode === "preferred") {
    console.log(`Backend port ${backendPort.preferredPort} is available.`);
  } else {
    console.log(
      `Backend port ${backendPort.preferredPort} is in use; requesting an OS-assigned port.`
    );
  }

  console.log("Starting backend...");

  const backend = spawnManagedProcess("backend", {
    ...backendCommand,
    cwd: workspaceRoot,
    env: {
      HOST: host,
      PORT: String(backendPort.port)
    }
  });
  children.push(backend);

  const backendBaseUrl = await waitForReadyLine(backend, parseBackendBaseUrl, {
    componentName: "backend",
    timeoutMs: startupTimeoutMs
  });

  console.log(`Backend ready: ${backendBaseUrl}`);
  console.log("Starting frontend...");

  const frontend = spawnManagedProcess("frontend", {
    ...frontendCommand,
    cwd: workspaceRoot,
    env: {
      VITE_API_BASE_URL: backendBaseUrl
    }
  });
  children.push(frontend);

  let frontendUrl = null;

  try {
    frontendUrl = await waitForReadyLine(frontend, parseFrontendLocalUrl, {
      componentName: "frontend",
      timeoutMs: startupTimeoutMs
    });
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    terminateChildren(children);
    process.exitCode = 1;
    return;
  }

  console.log(
    formatSessionSummary({
      workspaceRoot,
      backendBaseUrl,
      frontendUrl
    })
  );

  if (process.env.DEV_EXIT_AFTER_READY === "1") {
    terminateChildren(children);
    cleanupSignalHandlers();
    return;
  }

  for (const child of children) {
    child.once("exit", (code, signal) => {
      const name = child === backend ? "backend" : "frontend";

      if (process.exitCode === undefined) {
        console.error(
          formatRecoveryHint(
            name,
            `process exited (code=${code ?? "null"}, signal=${signal ?? "null"})`
          )
        );
        process.exitCode = code ?? 1;
      }

      terminateChildren(children);
    });
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  terminateChildren(children);
  cleanupSignalHandlers();
  process.exitCode = 1;
});
