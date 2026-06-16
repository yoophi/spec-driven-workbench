# Data Model: 프로젝트 기본 구조 설정

이 feature는 영속 데이터 모델을 만들지 않는다. 대신 repository structure와 개발
명령을 구현 대상 entity로 정의한다.

## Workspace

**설명**: 루트 package 관리 단위. `apps/web`과 `apps/backend`를 workspace package로
묶고 공통 명령을 제공한다.

**Fields**

- `packageManager`: `pnpm`
- `packages`: `apps/*`
- `scripts`: `dev`, `build`, `typecheck`

**Validation Rules**

- `pnpm-workspace.yaml`은 `apps/*`를 포함해야 한다.
- 루트 `package.json`은 workspace 전체 명령을 제공해야 한다.
- 루트 명령은 각 앱 package script를 호출할 수 있어야 한다.

## Web App

**설명**: `apps/web`에 위치한 SPA package.

**Fields**

- `path`: `apps/web`
- `framework`: `React`
- `language`: `TypeScript`
- `buildTool`: `Vite`
- `statusFeedback`: API 연결 상태의 loading, success, failure 표현

**Validation Rules**

- `apps/web/package.json`은 `dev`, `build`, `typecheck` script를 가져야 한다.
- 기본 화면은 앱 이름과 API 연결 확인 상태를 표시해야 한다.
- API 연결 실패는 사용자에게 확인 가능한 메시지로 표시되어야 한다.

## Backend App

**설명**: `apps/backend`에 위치한 REST API server package.

**Fields**

- `path`: `apps/backend`
- `framework`: `Hono`
- `language`: `TypeScript`
- `healthEndpoint`: `/health`

**Validation Rules**

- `apps/backend/package.json`은 `dev`, `build`, `typecheck` script를 가져야 한다.
- `/health`는 성공 상태와 JSON 응답을 반환해야 한다.
- 서버 시작 실패는 console log 또는 process error로 확인 가능해야 한다.

## Developer Command

**설명**: 개발자가 반복 실행하는 표준 명령.

**Fields**

- `install`: `pnpm install`
- `devWeb`: `pnpm --filter web dev`
- `devBackend`: `pnpm --filter backend dev`
- `build`: `pnpm build`
- `typecheck`: `pnpm typecheck`

**Validation Rules**

- quickstart에 명령과 기대 결과가 문서화되어야 한다.
- 각 명령은 실패 시 원인을 확인할 수 있는 output을 제공해야 한다.
