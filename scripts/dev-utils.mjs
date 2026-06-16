import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { createInterface } from "node:readline";

export const DEFAULT_BACKEND_HOST = "127.0.0.1";
export const DEFAULT_BACKEND_PORT = 3000;
export const DEFAULT_STARTUP_TIMEOUT_MS = 15_000;

const BACKEND_URL_PATTERN =
  /backend server listening on (https?:\/\/[^\s/]+:\d+)/i;
const FRONTEND_URL_PATTERN = /(https?:\/\/(?:localhost|127\.0\.0\.1)[^\s]*)/i;

export function parseBackendBaseUrl(line) {
  const match = BACKEND_URL_PATTERN.exec(line);
  return match?.[1] ?? null;
}

export function parseFrontendLocalUrl(line) {
  if (!line.includes("Local:")) {
    return null;
  }

  const match = FRONTEND_URL_PATTERN.exec(line);
  return match?.[1]?.replace(/\/$/, "") ?? null;
}

export function formatRecoveryHint(component, detail) {
  return [
    `${component} startup failed: ${detail}`,
    "Recovery: stop stale dev processes, check the command output above, then run `pnpm run dev` again."
  ].join("\n");
}

export function formatSessionSummary({ workspaceRoot, backendBaseUrl, frontendUrl }) {
  return [
    "",
    "Development session ready",
    `Workspace: ${workspaceRoot}`,
    `Backend:   ${backendBaseUrl}`,
    `Frontend:  ${frontendUrl ?? "starting; see Vite output for the local URL"}`,
    ""
  ].join("\n");
}

export async function isPortAvailable(port, host = DEFAULT_BACKEND_HOST) {
  return new Promise((resolve) => {
    const server = createServer();

    server.once("error", () => {
      resolve(false);
    });

    server.once("listening", () => {
      server.close(() => {
        resolve(true);
      });
    });

    server.listen(port, host);
  });
}

export async function selectBackendPort({
  preferredPort = DEFAULT_BACKEND_PORT,
  host = DEFAULT_BACKEND_HOST
} = {}) {
  const available = await isPortAvailable(preferredPort, host);

  if (available) {
    return {
      preferredPort,
      port: preferredPort,
      mode: "preferred",
      reason: "preferred backend port is available"
    };
  }

  return {
    preferredPort,
    port: 0,
    mode: "os-assigned",
    reason: `preferred backend port ${preferredPort} is already in use`
  };
}

export function commandFromEnv(value, fallback) {
  if (!value) {
    return fallback;
  }

  return {
    command: value,
    args: [],
    shell: true
  };
}

export function spawnManagedProcess(
  name,
  { command, args = [], cwd = process.cwd(), env = {}, shell = false },
  { onLine, stdout = process.stdout, stderr = process.stderr } = {}
) {
  const child = spawn(command, args, {
    cwd,
    env: {
      ...process.env,
      ...env
    },
    shell,
    stdio: ["ignore", "pipe", "pipe"]
  });
  child.devLines = [];

  const stdoutLines = createInterface({ input: child.stdout });
  const stderrLines = createInterface({ input: child.stderr });

  stdoutLines.on("line", (line) => {
    child.devLines.push(line);
    child.emit("dev-line", line, "stdout");
    stdout.write(`[${name}] ${line}\n`);
    onLine?.(line, "stdout");
  });

  stderrLines.on("line", (line) => {
    child.devLines.push(line);
    child.emit("dev-line", line, "stderr");
    stderr.write(`[${name}] ${line}\n`);
    onLine?.(line, "stderr");
  });

  return child;
}

export function waitForReadyLine(
  child,
  parser,
  {
    componentName,
    timeoutMs = DEFAULT_STARTUP_TIMEOUT_MS
  } = {}
) {
  return new Promise((resolve, reject) => {
    let settled = false;

    const cleanup = () => {
      settled = true;
      clearTimeout(timeout);
      child.off("dev-line", onLine);
      child.off("exit", onExit);
      child.off("error", onError);
    };

    const fail = (detail) => {
      if (settled) {
        return;
      }

      cleanup();
      reject(new Error(formatRecoveryHint(componentName, detail)));
    };

    const timeout = setTimeout(() => {
      fail(`readiness output was not detected within ${timeoutMs}ms`);
    }, timeoutMs);

    const onExit = (code, signal) => {
      fail(`process exited before readiness (code=${code ?? "null"}, signal=${signal ?? "null"})`);
    };

    const onError = (error) => {
      fail(error.message);
    };

    child.once("exit", onExit);
    child.once("error", onError);

    const onLine = (line) => {
      const value = parser(line);

      if (value) {
        cleanup();
        resolve(value);
      }
    };

    for (const line of child.devLines ?? []) {
      onLine(line);

      if (settled) {
        return;
      }
    }

    child.on("dev-line", onLine);
  });
}

export function terminateChildren(children, signal = "SIGTERM") {
  for (const child of children) {
    if (!child.killed && child.exitCode === null) {
      child.kill(signal);
    }
  }
}

export function forwardTerminationSignals(children, onTerminate = () => {}) {
  const handler = (signal) => {
    onTerminate(signal);
    terminateChildren(children, signal);
    setTimeout(() => process.exit(0), 50).unref();
  };

  process.once("SIGINT", handler);
  process.once("SIGTERM", handler);

  return () => {
    process.off("SIGINT", handler);
    process.off("SIGTERM", handler);
  };
}
