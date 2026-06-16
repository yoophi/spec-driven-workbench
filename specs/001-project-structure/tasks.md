# Tasks: 프로젝트 기본 구조 설정

<!--
  Spec-related prose MUST be written in Korean. Technical terms, code,
  commands, identifiers, API paths, package names, and quoted source text may
  remain in their original language when needed for precision.
-->

**Input**: Design documents from `/specs/001-project-structure/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: 별도 test framework는 이 feature에서 요청되지 않았다. 각 user story는
`pnpm install`, workspace 명령 확인, `typecheck`, `build`, `/health`, quickstart
수동 확인으로 검증한다.

**Organization**: Task는 user story별 독립 구현과 검증이 가능하도록 그룹화한다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 다른 파일을 수정하며 선행 task에 의존하지 않아 병렬 실행 가능
- **[Story]**: user story task에만 사용하며 `US1`, `US2`, `US3`로 표시
- 모든 task는 실행 대상 파일 경로를 포함한다

## Path Conventions

- **Workspace root**: `package.json`, `pnpm-workspace.yaml`, `tsconfig.base.json`
- **Web app**: `apps/web/`
- **Backend app**: `apps/backend/`
- **Feature docs**: `specs/001-project-structure/`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: pnpm workspace와 공통 TypeScript 기반을 만든다.

- [X] T001 Create root workspace package manifest with `dev`, `build`, and `typecheck` scripts in package.json
- [X] T002 Create pnpm workspace package mapping for `apps/*` in pnpm-workspace.yaml
- [X] T003 Create shared TypeScript compiler defaults in tsconfig.base.json
- [X] T004 Create apps directory for workspace packages in apps/.gitkeep
- [X] T005 Update implementation notes for workspace commands in specs/001-project-structure/quickstart.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 각 user story가 같은 package 이름과 명령 규칙을 사용하도록 앱 package skeleton을 만든다.

**CRITICAL**: 이 phase가 끝나기 전에는 user story 구현을 시작하지 않는다.

- [X] T006 Create web app package manifest with `name: web`, `dev`, `build`, and `typecheck` scripts in apps/web/package.json
- [X] T007 Create backend app package manifest with `name: backend`, `dev`, `build`, and `typecheck` scripts in apps/backend/package.json
- [X] T008 [P] Create web TypeScript config extending root defaults in apps/web/tsconfig.json
- [X] T009 [P] Create backend TypeScript config extending root defaults in apps/backend/tsconfig.json
- [X] T010 [P] Create web Vite config in apps/web/vite.config.ts
- [X] T011 [P] Create backend source directory placeholder in apps/backend/src/.gitkeep
- [X] T012 [P] Create web source directory placeholder in apps/web/src/.gitkeep

**Checkpoint**: workspace package skeleton이 준비되어 user story 구현을 시작할 수 있다.

---

## Phase 3: User Story 1 - 한 번에 개발 환경 준비 (Priority: P1) MVP

**Goal**: 새 checkout 후 `pnpm install`과 workspace 명령 확인으로 기본 구조를 검증할 수 있다.

**Independent Test**: `pnpm install` 후 `pnpm --filter web --if-present typecheck`와
`pnpm --filter backend --if-present typecheck` 명령이 각 package를 찾는지 확인한다.

### Implementation for User Story 1

- [X] T013 [US1] Add root package metadata and workspace-level command delegation in package.json
- [X] T014 [US1] Add dependency and script definitions for the web workspace package in apps/web/package.json
- [X] T015 [US1] Add dependency and script definitions for the backend workspace package in apps/backend/package.json
- [X] T016 [US1] Document install and workspace package verification steps in specs/001-project-structure/quickstart.md
- [X] T017 [US1] Run `pnpm install` and commit generated lockfile in pnpm-lock.yaml
- [X] T018 [US1] Verify workspace package discovery with `pnpm --filter web exec pwd` and `pnpm --filter backend exec pwd` from package.json command context

**Checkpoint**: User Story 1은 web/backend package가 workspace에 잡히는 상태로 독립 검증된다.

---

## Phase 4: User Story 2 - SPA 앱 기본 실행 (Priority: P2)

**Goal**: `apps/web`에서 React + TypeScript + Vite 기반 기본 SPA를 실행하고 API 연결 상태를 표시한다.

**Independent Test**: `pnpm --filter web dev` 실행 후 브라우저에서 기본 화면이 보이고,
backend 실행 여부에 따라 API 연결 상태가 loading, success, failure 중 하나로 표시된다.

### Implementation for User Story 2

- [X] T019 [P] [US2] Create Vite HTML entry point in apps/web/index.html
- [X] T020 [P] [US2] Create React application entry point in apps/web/src/main.tsx
- [X] T021 [US2] Implement SPA status and API health feedback UI in apps/web/src/App.tsx
- [X] T022 [P] [US2] Add responsive base styles for loading, success, and failure states in apps/web/src/styles.css
- [X] T023 [US2] Configure web environment default API base URL handling in apps/web/src/App.tsx
- [X] T024 [US2] Verify web typecheck with `pnpm --filter web typecheck` for apps/web/tsconfig.json
- [X] T025 [US2] Verify web build with `pnpm --filter web build` for apps/web/vite.config.ts
- [X] T026 [US2] Document web execution and API feedback expectations in specs/001-project-structure/quickstart.md

**Checkpoint**: User Story 2는 backend가 없어도 SPA 화면과 실패 피드백을 표시하는 상태로 독립 검증된다.

---

## Phase 5: User Story 3 - REST API 서버 기본 실행 (Priority: P3)

**Goal**: `apps/backend`에서 Hono + TypeScript REST API 서버를 실행하고 `/health` 성공 응답을 반환한다.

**Independent Test**: `pnpm --filter backend dev` 실행 후 `curl http://localhost:<backend-port>/health`가
1초 이내 `{ "status": "ok", "service": "backend" }` JSON을 반환한다.

### Implementation for User Story 3

- [X] T027 [US3] Implement Hono app with `GET /health` JSON response in apps/backend/src/index.ts
- [X] T028 [US3] Configure backend build output and Node-compatible TypeScript options in apps/backend/tsconfig.json
- [X] T029 [US3] Verify backend typecheck with `pnpm --filter backend typecheck` for apps/backend/tsconfig.json
- [X] T030 [US3] Verify backend build with `pnpm --filter backend build` for apps/backend/package.json
- [X] T031 [US3] Verify `/health` manually with curl command documented in specs/001-project-structure/quickstart.md
- [X] T032 [US3] Document backend port and health response expectation in specs/001-project-structure/contracts/backend-api.md

**Checkpoint**: User Story 3은 REST API 서버와 `/health` contract가 독립 검증되는 상태다.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 문서, 검증 명령, constitution 기준을 최종 정리한다.

- [X] T033 Run full workspace typecheck with `pnpm typecheck` and record result in specs/001-project-structure/quickstart.md
- [X] T034 Run full workspace build with `pnpm build` and record result in specs/001-project-structure/quickstart.md
- [X] T035 Review generated files for unnecessary traffic-scale optimization and document absence in specs/001-project-structure/research.md
- [X] T036 Verify all spec-related prose remains Korean except technical terms and code in specs/001-project-structure/tasks.md
- [X] T037 Update repository guidance if command names changed in AGENTS.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 선행 의존성 없음
- **Foundational (Phase 2)**: Phase 1 완료 후 진행; 모든 user story를 block
- **User Story 1 (Phase 3)**: Phase 2 완료 후 진행; MVP
- **User Story 2 (Phase 4)**: Phase 2 완료 후 진행 가능; US1 완료 시 설치/lockfile 검증이 안정적
- **User Story 3 (Phase 5)**: Phase 2 완료 후 진행 가능; US2와 병렬 가능
- **Polish (Phase 6)**: 구현할 user story 완료 후 진행

### User Story Dependencies

- **US1**: workspace 설치와 package discovery만 검증하므로 Phase 2 이후 독립 가능
- **US2**: web package skeleton에 의존하며 backend 없이 failure feedback으로 독립 검증 가능
- **US3**: backend package skeleton에 의존하며 web 없이 `/health`로 독립 검증 가능

### Within Each User Story

- package manifest와 config가 먼저 준비되어야 한다.
- UI/endpoint 구현 후 typecheck와 build를 실행한다.
- quickstart와 contract 문서는 실제 명령과 응답을 반영하도록 마지막에 갱신한다.

### Parallel Opportunities

- T008-T012는 서로 다른 파일을 수정하므로 병렬 가능하다.
- US2의 T019, T020, T022는 서로 다른 파일을 수정하므로 병렬 가능하다.
- US2와 US3는 Phase 2 이후 다른 앱을 수정하므로 병렬 가능하다.

---

## Parallel Example: User Story 2

```bash
Task: "Create Vite HTML entry point in apps/web/index.html"
Task: "Create React application entry point in apps/web/src/main.tsx"
Task: "Add responsive base styles for loading, success, and failure states in apps/web/src/styles.css"
```

## Parallel Example: User Story 3

```bash
Task: "Implement Hono app with GET /health JSON response in apps/backend/src/index.ts"
Task: "Configure backend build output and Node-compatible TypeScript options in apps/backend/tsconfig.json"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. Stop and validate workspace package discovery

### Incremental Delivery

1. Setup + Foundational 완료
2. US1로 workspace install/discovery 검증
3. US2로 web SPA 기본 화면과 API feedback 검증
4. US3로 backend `/health` contract 검증
5. Polish에서 전체 typecheck/build와 문서 정리

### Parallel Team Strategy

1. 한 작업자가 root workspace와 package skeleton을 완료한다.
2. 이후 web 작업자는 US2, backend 작업자는 US3를 병렬로 진행한다.
3. 마지막에 full workspace verification을 함께 확인한다.

---

## Notes

- `[P]` task는 서로 다른 파일을 수정하고 선행 task가 없는 경우에만 표시했다.
- 모든 user story task는 `[US1]`, `[US2]`, `[US3]` label을 포함한다.
- 테스트 프레임워크 도입은 이 feature 범위 밖이다.
- 트래픽 규모 최적화는 측정된 개인 사용 병목이 없으므로 구현하지 않는다.
