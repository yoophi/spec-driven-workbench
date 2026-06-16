# Tasks: 프로젝트 선택 및 상세 조회

**Input**: Design documents from `/specs/002-project-selection/`  
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/](./contracts/), [quickstart.md](./quickstart.md)

**Tests**: Backend 변경은 Constitution에 따라 unit test와 integration test를 구현보다 먼저 작성한다. Frontend는 test harness를 도입하고 주요 상태를 component test와 quickstart로 검증한다.

**Organization**: 작업은 user story별로 독립 구현과 검증이 가능하도록 구성한다.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 서로 다른 파일을 다루며 미완료 작업에 의존하지 않아 병렬 처리 가능
- **[Story]**: user story phase 작업에만 사용
- 모든 작업은 실행 대상 file path를 포함한다

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: 테스트와 UI 기반 설정을 준비한다.

- [X] T001 Add backend Vitest scripts and dependencies in apps/backend/package.json
- [X] T002 [P] Add backend Vitest config in apps/backend/vitest.config.ts
- [X] T003 Add frontend Tailwind CSS and shadcn/ui dependencies in apps/web/package.json
- [X] T004 Initialize shadcn/ui configuration for Vite in apps/web/components.json
- [X] T005 Configure Tailwind CSS entry styles and design tokens in apps/web/src/styles.css
- [X] T006 [P] Add frontend test scripts and dependencies in apps/web/package.json
- [X] T007 [P] Add frontend Vitest config in apps/web/vitest.config.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: 모든 user story가 공유하는 architecture, API, UI 기반을 만든다.

**CRITICAL**: 이 phase가 끝나기 전에는 user story 구현을 시작하지 않는다.

- [X] T008 Create backend Hexagonal Architecture directories in apps/backend/src/domain/project.ts
- [X] T009 [P] Define Project domain type and validation helpers in apps/backend/src/domain/project.ts
- [X] T010 [P] Define ProjectRepository port contract in apps/backend/src/ports/project-repository.ts
- [X] T011 [P] Create backend project catalog config in apps/backend/src/config/projects-catalog.ts
- [X] T012 Create seed project catalog JSON in apps/backend/data/projects.json
- [X] T013 Create Hono app factory for route integration tests in apps/backend/src/app.ts
- [X] T014 Update backend server entrypoint to use app factory in apps/backend/src/index.ts
- [X] T015 [P] Create frontend shared API error model in apps/web/src/shared/api/api-error.ts
- [X] T016 [P] Create frontend Project entity type and display helpers in apps/web/src/entities/project/model.ts
- [X] T017 [P] Add shadcn/ui Button component in apps/web/src/shared/ui/button.tsx
- [X] T018 [P] Add shadcn/ui Card component in apps/web/src/shared/ui/card.tsx
- [X] T019 [P] Add shadcn/ui Alert component in apps/web/src/shared/ui/alert.tsx
- [X] T020 [P] Add shadcn/ui Skeleton component in apps/web/src/shared/ui/skeleton.tsx
- [X] T021 [P] Add shadcn/ui Badge component in apps/web/src/shared/ui/badge.tsx
- [X] T022 [P] Add shadcn/ui Empty component in apps/web/src/shared/ui/empty.tsx

**Checkpoint**: 테스트 harness, backend architecture 경계, frontend UI primitive가 준비되어 user story 구현을 시작할 수 있다.

---

## Phase 3: User Story 1 - 등록된 프로젝트 목록 확인 (Priority: P1)

**Goal**: 사용자가 등록된 프로젝트 목록을 확인하고 하나를 선택할 수 있다.

**Independent Test**: 등록된 프로젝트가 하나 이상 있는 상태에서 화면을 열고 목록이 표시되며 각 항목을 선택 가능한지 확인한다.

### Tests for User Story 1

- [X] T023 [P] [US1] Add ProjectsService listProjects unit tests in apps/backend/tests/unit/projects-service.test.ts
- [X] T024 [P] [US1] Add GET /projects integration tests in apps/backend/tests/integration/projects-routes.test.ts
- [X] T025 [P] [US1] Add project list rendering component tests in apps/web/tests/project-selection.test.tsx

### Implementation for User Story 1

- [X] T026 [US1] Implement FileProjectRepository list behavior in apps/backend/src/adapters/outbound/file-project-repository.ts
- [X] T027 [US1] Implement ProjectsService listProjects use case in apps/backend/src/application/projects-service.ts
- [X] T028 [US1] Implement GET /projects route in apps/backend/src/adapters/inbound/http/projects-routes.ts
- [X] T029 [US1] Register project routes in backend app factory in apps/backend/src/app.ts
- [X] T030 [P] [US1] Implement projects API client listProjects in apps/web/src/shared/api/projects-api.ts
- [X] T031 [P] [US1] Implement project list UI component in apps/web/src/entities/project/project-list.tsx
- [X] T032 [US1] Implement project selection state hook in apps/web/src/features/project-selection/use-project-selection.ts
- [X] T033 [US1] Compose project list widget and selection interaction in apps/web/src/widgets/project-workbench/project-workbench.tsx
- [X] T034 [US1] Render project selection page from App entrypoint in apps/web/src/app/App.tsx

**Checkpoint**: User Story 1은 독립적으로 동작하며 목록 표시와 선택 상태를 검증할 수 있다.

---

## Phase 4: User Story 2 - 선택한 프로젝트 상세정보 확인 (Priority: P2)

**Goal**: 사용자가 선택한 프로젝트의 이름, `path`, `git origin url` 상세정보를 확인한다.

**Independent Test**: 프로젝트를 하나 선택하고 상세 영역에 해당 프로젝트의 이름, `path`, `git origin url`이 표시되는지 확인한다.

### Tests for User Story 2

- [X] T035 [P] [US2] Add ProjectsService getProjectById unit tests in apps/backend/tests/unit/projects-service.test.ts
- [X] T036 [P] [US2] Add GET /projects/:projectId integration tests in apps/backend/tests/integration/projects-routes.test.ts
- [X] T037 [P] [US2] Add project detail rendering and selection-change component tests in apps/web/tests/project-selection.test.tsx

### Implementation for User Story 2

- [X] T038 [US2] Extend FileProjectRepository findById behavior in apps/backend/src/adapters/outbound/file-project-repository.ts
- [X] T039 [US2] Extend ProjectsService getProjectById use case in apps/backend/src/application/projects-service.ts
- [X] T040 [US2] Implement GET /projects/:projectId route and 404 mapping in apps/backend/src/adapters/inbound/http/projects-routes.ts
- [X] T041 [P] [US2] Extend projects API client getProjectById in apps/web/src/shared/api/projects-api.ts
- [X] T042 [P] [US2] Implement project detail UI component in apps/web/src/entities/project/project-detail.tsx
- [X] T043 [US2] Extend project selection hook to load selected project detail in apps/web/src/features/project-selection/use-project-selection.ts
- [X] T044 [US2] Integrate detail region with selected project state in apps/web/src/widgets/project-workbench/project-workbench.tsx

**Checkpoint**: User Story 1과 2가 모두 동작하며 선택 변경 시 상세정보 갱신을 독립 검증할 수 있다.

---

## Phase 5: User Story 3 - 프로젝트 정보 로딩 및 오류 상태 이해 (Priority: P3)

**Goal**: 사용자가 빈 목록, loading, 오류, retry, 누락값, stale selection 상태를 이해하고 복구할 수 있다.

**Independent Test**: 등록 프로젝트가 없는 상태와 프로젝트 정보를 불러오지 못하는 상태를 각각 만들고, 화면이 빈 상태 안내와 오류 복구 행동을 제공하는지 확인한다.

### Tests for User Story 3

- [X] T045 [P] [US3] Add backend catalog unavailable and invalid catalog tests in apps/backend/tests/integration/projects-routes.test.ts
- [X] T046 [P] [US3] Add frontend loading empty error retry and missing value tests in apps/web/tests/project-selection.test.tsx
- [X] T047 [P] [US3] Add manual empty and error verification notes in specs/002-project-selection/quickstart.md

### Implementation for User Story 3

- [X] T048 [US3] Add catalog parse and unavailable error mapping in apps/backend/src/adapters/outbound/file-project-repository.ts
- [X] T049 [US3] Add application-level not-found and catalog error types in apps/backend/src/application/projects-service.ts
- [X] T050 [US3] Return PROJECT_CATALOG_UNAVAILABLE and PROJECT_NOT_FOUND response bodies in apps/backend/src/adapters/inbound/http/projects-routes.ts
- [X] T051 [P] [US3] Normalize frontend API error states in apps/web/src/shared/api/projects-api.ts
- [X] T052 [P] [US3] Implement empty loading error and retry UI states in apps/web/src/widgets/project-workbench/project-workbench.tsx
- [X] T053 [US3] Add missing git origin url display behavior in apps/web/src/entities/project/project-detail.tsx
- [X] T054 [US3] Handle stale selected project recovery in apps/web/src/features/project-selection/use-project-selection.ts

**Checkpoint**: 모든 user story가 독립 검증 가능하며 robust web states가 구현되어 있다.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: 전체 기능 품질과 문서, architecture 준수를 확인한다.

- [X] T055 [P] Update quickstart commands and expected results in specs/002-project-selection/quickstart.md
- [X] T056 [P] Verify Feature-Sliced Design dependency direction in apps/web/src/features/project-selection/use-project-selection.ts
- [X] T057 [P] Verify backend domain/application code has no Hono or file-system dependency in apps/backend/src/application/projects-service.ts
- [X] T058 Run backend unit and integration tests and fix failures in apps/backend/tests/unit/projects-service.test.ts
- [X] T059 Run frontend component tests and fix failures in apps/web/tests/project-selection.test.tsx
- [X] T060 Run pnpm typecheck and build and fix failures in package.json
- [X] T061 Validate quickstart manually and record any corrections in specs/002-project-selection/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 즉시 시작 가능
- **Foundational (Phase 2)**: Setup 완료 후 진행하며 모든 user story를 block한다
- **User Stories (Phase 3+)**: Foundational 완료 후 시작 가능
- **Polish (Phase 6)**: 구현 대상 user story 완료 후 진행

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 완료 후 시작 가능, MVP 범위
- **User Story 2 (P2)**: 상세 조회는 선택된 project id가 필요하므로 US1 이후 진행 권장
- **User Story 3 (P3)**: 오류/빈 상태는 US1/US2 흐름을 보강하므로 US1과 US2 이후 진행 권장

### Within Each User Story

- Tests를 구현보다 먼저 작성한다
- Backend domain/application behavior를 adapter보다 먼저 구현한다
- Port와 service behavior를 확정한 뒤 outbound/inbound adapter를 연결한다
- Frontend API client와 entity UI를 만든 뒤 widget/page에서 조합한다
- 각 story checkpoint에서 독립 검증 후 다음 priority로 이동한다

## Parallel Opportunities

- T002, T006, T007은 서로 다른 config/package 영역이라 병렬 가능
- T009, T010, T011, T015, T016, T017-T022는 foundational 파일이 분리되어 병렬 가능
- US1의 T023-T025 테스트 작업은 병렬 가능
- US1의 T030과 T031은 API client와 UI component가 분리되어 병렬 가능
- US2의 T035-T037 테스트 작업은 병렬 가능
- US2의 T041과 T042는 API client와 detail UI component가 분리되어 병렬 가능
- US3의 T045-T047 테스트/문서 작업은 병렬 가능
- US3의 T051과 T052는 error normalization과 widget state rendering이 분리되어 병렬 가능
- Polish의 T055-T057은 서로 다른 문서/architecture 점검이라 병렬 가능

## Parallel Example: User Story 1

```bash
# US1 테스트 작업 병렬
Task: "T023 [US1] Add ProjectsService listProjects unit tests in apps/backend/tests/unit/projects-service.test.ts"
Task: "T024 [US1] Add GET /projects integration tests in apps/backend/tests/integration/projects-routes.test.ts"
Task: "T025 [US1] Add project list rendering component tests in apps/web/tests/project-selection.test.tsx"

# US1 frontend/backend 분리 작업 병렬
Task: "T030 [US1] Implement projects API client listProjects in apps/web/src/shared/api/projects-api.ts"
Task: "T031 [US1] Implement project list UI component in apps/web/src/entities/project/project-list.tsx"
```

## Parallel Example: User Story 2

```bash
Task: "T035 [US2] Add ProjectsService getProjectById unit tests in apps/backend/tests/unit/projects-service.test.ts"
Task: "T036 [US2] Add GET /projects/:projectId integration tests in apps/backend/tests/integration/projects-routes.test.ts"
Task: "T037 [US2] Add project detail rendering and selection-change component tests in apps/web/tests/project-selection.test.tsx"
```

## Parallel Example: User Story 3

```bash
Task: "T045 [US3] Add backend catalog unavailable and invalid catalog tests in apps/backend/tests/integration/projects-routes.test.ts"
Task: "T046 [US3] Add frontend loading empty error retry and missing value tests in apps/web/tests/project-selection.test.tsx"
Task: "T047 [US3] Add manual empty and error verification notes in specs/002-project-selection/quickstart.md"
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1
4. STOP and validate `/projects`와 프로젝트 목록 선택 UI
5. Demo or review MVP before adding detail/error behavior

### Incremental Delivery

1. Setup + Foundational 완료
2. US1 완료 후 목록 선택 MVP 검증
3. US2 완료 후 상세정보 검증
4. US3 완료 후 loading, empty, error, retry 상태 검증
5. Polish 단계에서 전체 quickstart와 automated checks 실행
