# Tasks: 중복 실행 가능한 개발환경

**Input**: Design documents from `/specs/002-concurrent-dev-env/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Root dev utility의 core behavior는 Node.js test runner로 자동 검증한다.
Backend API behavior는 변경하지 않지만 backend process 실행과 adapter boundary에
해당하는 root CLI orchestration은 integration test로 검증한다.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Root dev utility와 테스트 실행 기반을 준비한다.

- [X] T001 Update root scripts for `dev` and `test` commands in package.json
- [X] T002 [P] Create root dev orchestration entrypoint in scripts/dev.mjs
- [X] T003 [P] Create root dev utility module in scripts/dev-utils.mjs
- [X] T004 [P] Create unit test directory and placeholder in tests/unit/dev-utils.test.mjs
- [X] T005 [P] Create integration test directory and placeholder in tests/integration/dev-command.test.mjs

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 user story가 의존하는 port selection, process spawning, output parsing
기반을 만든다.

**CRITICAL**: No user story work can begin until this phase is complete.

- [X] T006 Write failing tests for URL parsing and base URL extraction in tests/unit/dev-utils.test.mjs
- [X] T007 Write failing tests for preferred port availability detection in tests/unit/dev-utils.test.mjs
- [X] T008 Implement `parseBackendBaseUrl` and readiness output contract in scripts/dev-utils.mjs
- [X] T009 Implement `isPortAvailable` and backend port mode selection in scripts/dev-utils.mjs
- [X] T010 Implement child process spawn helpers and signal forwarding utilities in scripts/dev-utils.mjs

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - 여러 작업 세션을 동시에 실행한다 (Priority: P1)

**Goal**: `pnpm run dev`가 backend를 먼저 실행하고 실제 backend base URL을 frontend에
전달해, 기본 port가 이미 사용 중이어도 두 번째 개발환경이 자동으로 실행된다.

**Independent Test**: 기본 backend port를 점유한 상태에서 root dev 명령을 실행하고,
backend가 다른 port로 listening 되며 frontend가 해당 URL을 전달받는지 확인한다.

### Tests for User Story 1

- [X] T011 [US1] Write integration test for occupied backend default port in tests/integration/dev-command.test.mjs
- [X] T012 [US1] Write integration test for frontend receiving `VITE_API_BASE_URL` in tests/integration/dev-command.test.mjs

### Implementation for User Story 1

- [X] T013 [US1] Implement backend-first orchestration flow in scripts/dev.mjs
- [X] T014 [US1] Pass actual backend base URL to frontend env in scripts/dev.mjs
- [X] T015 [US1] Update package scripts to use root dev utility in package.json

**Checkpoint**: User Story 1 works independently.

---

## Phase 4: User Story 2 - 충돌 상황을 이해하고 복구한다 (Priority: P2)

**Goal**: Backend/frontend startup failure와 partial failure가 발생했을 때 구성요소,
원인, 복구 action이 terminal에 명확히 표시된다.

**Independent Test**: Backend readiness 전에 process가 종료되거나 frontend spawn이
실패하는 상황을 test double로 만들고, root dev utility가 frontend를 시작하지 않거나
부분 실패를 명확히 보고하는지 확인한다.

### Tests for User Story 2

- [X] T016 [US2] Write unit tests for startup timeout and process failure messages in tests/unit/dev-utils.test.mjs
- [X] T017 [US2] Write integration test for backend startup failure behavior in tests/integration/dev-command.test.mjs

### Implementation for User Story 2

- [X] T018 [US2] Implement startup timeout, failure reporting, and recovery hints in scripts/dev-utils.mjs
- [X] T019 [US2] Integrate failure reporting and child cleanup in scripts/dev.mjs

**Checkpoint**: User Story 1 and 2 work independently.

---

## Phase 5: User Story 3 - 동시에 실행 중인 환경을 구분한다 (Priority: P3)

**Goal**: Terminal output에서 backend URL, frontend URL, workspace root가 표시되어 여러
dev session을 구분할 수 있다.

**Independent Test**: root dev command output에서 workspace root와 backend/frontend
접근 위치를 확인한다.

### Tests for User Story 3

- [X] T020 [US3] Write unit tests for session summary formatting in tests/unit/dev-utils.test.mjs

### Implementation for User Story 3

- [X] T021 [US3] Implement session summary output with workspace root and URLs in scripts/dev-utils.mjs
- [X] T022 [US3] Print session summary during root dev startup in scripts/dev.mjs

**Checkpoint**: All user stories work independently.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 검증, ignore 파일, 문서 정합성을 마무리한다.

- [X] T023 Verify or update .gitignore with Node.js, TypeScript, and universal patterns in .gitignore
- [X] T024 Run `pnpm test` and fix failures in scripts/dev-utils.mjs, scripts/dev.mjs, tests/unit/dev-utils.test.mjs, tests/integration/dev-command.test.mjs
- [X] T025 Run `pnpm run typecheck` and fix type errors across package.json, apps/backend/src/index.ts, apps/web/src/App.tsx, scripts/dev.mjs
- [X] T026 Run `pnpm run build` and fix build failures across apps/backend and apps/web
- [X] T027 Validate quickstart concurrent-dev scenario and update specs/002-concurrent-dev-env/quickstart.md if observed behavior differs

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies.
- **Foundational (Phase 2)**: Depends on Setup completion and blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; can reuse US1 process cleanup.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; can reuse US1 URLs.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: MVP; required for the user-requested smooth root dev flow.
- **User Story 2 (P2)**: Independent failure reporting, integrates with US1 orchestration.
- **User Story 3 (P3)**: Independent session identification, integrates with US1 output.

### Parallel Opportunities

- T002, T003, T004, T005 can run in parallel after T001 decision.
- Unit test authoring and integration test authoring can be separated by file.
- US2 and US3 tests can be authored in parallel after foundational utilities exist.

## Implementation Strategy

### MVP First

1. Complete Phase 1 and Phase 2.
2. Complete US1 tasks T011-T015.
3. Validate with `pnpm test` and manual `pnpm run dev` occupied-port scenario.

### Full Delivery

1. Complete Setup and Foundational tasks.
2. Implement US1 for automatic backend port selection and frontend env handoff.
3. Implement US2 for clear failure reporting and cleanup.
4. Implement US3 for session identification.
5. Run test, typecheck, build, and quickstart validation.
