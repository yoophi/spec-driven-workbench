# Quickstart: 프로젝트 기본 구조 설정

## 전제 조건

- Node.js LTS 계열
- pnpm 사용 가능

## 설치

```bash
pnpm install
```

기대 결과:

- 루트 workspace 의존성이 설치된다.
- `apps/web`과 `apps/backend` package가 workspace에 포함된다.

## Workspace package 확인

```bash
pnpm -r list --depth -1
pnpm --filter web exec pwd
pnpm --filter backend exec pwd
```

기대 결과:

- `web` package는 `apps/web` 경로로 확인된다.
- `backend` package는 `apps/backend` 경로로 확인된다.

## 웹 앱 실행

```bash
pnpm --filter web dev
```

기대 결과:

- Vite dev server가 시작된다.
- 브라우저에서 기본 SPA 화면을 확인할 수 있다.
- 화면에는 앱 실행 상태와 API 연결 상태가 표시된다.
- API 서버가 꺼져 있으면 연결 실패 상태와 backend 실행 확인 안내가 표시된다.
- `VITE_API_BASE_URL`을 지정하지 않으면 기본 API base URL은 `http://127.0.0.1:3000`이다.

## API 서버 실행

```bash
pnpm --filter backend dev
```

기대 결과:

- Hono 기반 API 서버가 로컬 port에서 시작된다.
- `/health` endpoint가 성공 응답을 반환한다.

## API 상태 확인

```bash
curl http://127.0.0.1:3000/health
```

기대 결과:

```json
{
  "status": "ok",
  "service": "backend"
}
```

## 전체 검증

```bash
pnpm typecheck
pnpm build
```

기대 결과:

- web/backend TypeScript 검증이 통과한다.
- web/backend build가 성공한다.

검증 결과 기록:

- `pnpm typecheck`: PASS
- `pnpm build`: PASS
- `curl http://127.0.0.1:3000/health`: PASS, `{"status":"ok","service":"backend"}`

## 문제 상황 확인

- port 충돌이 발생하면 해당 dev command output에서 충돌 원인을 확인한다.
- backend가 꺼진 상태에서도 web 기본 화면은 표시되어야 하며 API 연결 실패 상태를 보여야 한다.
- 트래픽 규모 최적화, 배포, DB, 인증은 이 feature의 검증 범위가 아니다.
