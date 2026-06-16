import { useEffect, useMemo, useState } from "react";

type HealthStatus =
  | { state: "loading"; message: string }
  | { state: "success"; message: string; service: string }
  | { state: "failure"; message: string };

type HealthResponse = {
  status?: string;
  service?: string;
};

const DEFAULT_API_BASE_URL = "http://127.0.0.1:3000";

function getApiBaseUrl() {
  return import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL;
}

export function App() {
  const apiBaseUrl = useMemo(getApiBaseUrl, []);
  const [health, setHealth] = useState<HealthStatus>({
    state: "loading",
    message: "API 연결 상태를 확인하는 중입니다."
  });

  useEffect(() => {
    const controller = new AbortController();

    async function checkHealth() {
      try {
        const response = await fetch(`${apiBaseUrl}/health`, {
          signal: controller.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const body = (await response.json()) as HealthResponse;

        setHealth({
          state: "success",
          message: "API 서버와 연결되었습니다.",
          service: body.service ?? "backend"
        });
      } catch (error) {
        if (controller.signal.aborted) {
          return;
        }

        const detail = error instanceof Error ? error.message : "unknown error";

        setHealth({
          state: "failure",
          message: `API 서버에 연결할 수 없습니다. backend dev server 실행 여부를 확인하세요. (${detail})`
        });
      }
    }

    void checkHealth();

    return () => controller.abort();
  }, [apiBaseUrl]);

  return (
    <main className="app-shell">
      <section className="status-panel" aria-labelledby="app-title">
        <p className="eyebrow">Spec Driven Workbench</p>
        <h1 id="app-title">프로젝트 기본 구조</h1>
        <p className="summary">
          React, TypeScript, Vite 기반 SPA가 실행 중입니다.
        </p>

        <div className={`health-card health-card--${health.state}`} role="status">
          <span className="status-dot" aria-hidden="true" />
          <div>
            <strong>
              {health.state === "loading" && "확인 중"}
              {health.state === "success" && "연결 성공"}
              {health.state === "failure" && "연결 실패"}
            </strong>
            <p>{health.message}</p>
            {health.state === "success" ? (
              <small>service: {health.service}</small>
            ) : (
              <small>API base URL: {apiBaseUrl}</small>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
