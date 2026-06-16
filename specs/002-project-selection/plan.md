# Implementation Plan: 프로젝트 선택 및 상세 조회

**Branch**: `002-project-selection` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-project-selection/spec.md`

## Summary

등록된 프로젝트 목록을 백엔드에서 읽어 제공하고, 프론트엔드에서 사용자가 프로젝트를
선택한 뒤 이름, `path`, `git origin url` 상세정보를 확인할 수 있게 한다. 백엔드는
JSON 파일 기반 프로젝트 catalog를 Hexagonal Architecture 경계 안에 두고, 프론트엔드는
Feature-Sliced Design의 `projects` slice와 shadcn/ui 기반 UI로 목록, 상세, loading,
empty, error, retry 상태를 제공한다.

## Technical Context

**Language/Version**: TypeScript, Node.js LTS 계열  
**Primary Dependencies**: pnpm workspace, React, Vite, Hono, Tailwind CSS, shadcn/ui, Vitest  
**Storage**: 백엔드가 관리하는 JSON 파일 기반 프로젝트 catalog  
**Testing**: Vitest 기반 backend unit/integration tests, frontend component tests 또는 manual quickstart check, TypeScript typecheck, Vite build  
**Target Platform**: 로컬 개발 환경의 최신 브라우저와 Node.js runtime  
**Project Type**: pnpm monorepo web application; SPA + REST API server  
**Performance Goals**: 로컬에서 프로젝트 목록 화면 2초 이내 표시, 프로젝트 선택 후 상세정보 2초 이내 갱신, 오류/재시도 feedback 즉시 표시  
**Constraints**: spec 문서는 한글 작성, frontend는 Feature-Sliced Design + Tailwind CSS + shadcn/ui 사용, backend는 Hexagonal Architecture와 unit/integration tests 포함, JSON catalog 항목만 표시, 프로젝트 생성/수정/삭제/검색/정렬/인증/권한 제외  
**Scale/Scope**: 개인용 로컬 workbench; 대표 프로젝트 5개 수준의 목록과 상세 확인 흐름

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Korean spec documentation**: PASS. `plan.md`, `research.md`, `data-model.md`,
  `quickstart.md`, contract 문서는 한글 prose로 작성하고 기술 용어와 경로는 원문을 유지한다.
- **Spec-first user value**: PASS. 계획은 P1 목록 확인, P2 상세 확인, P3 loading/empty/error
  이해 user story와 success criteria에 직접 연결된다.
- **Robust web behavior**: PASS. loading, empty, error, retry, 선택 해제, 누락값 표시 상태를
  contract와 quickstart에서 검증한다.
- **Fast user feedback**: PASS. 목록 로딩, 선택 변경, 오류 재시도 모두 visible feedback을 제공한다.
- **Verification path**: PASS. Backend domain/application unit test와 API integration test,
  frontend 화면 상태 검증, quickstart 수동 확인을 정의한다.
- **Frontend architecture**: PASS. Frontend 변경은 `entities/project`, `features/project-selection`,
  `widgets/project-workbench`, `pages/project-selection`, `shared/api` slice로 제한하고 Tailwind CSS와
  shadcn/ui 초기화를 선행한다.
- **Backend architecture and tests**: PASS. Backend 변경은 domain/application, port,
  inbound adapter, outbound adapter를 분리하고 Vitest 기반 unit/integration test 도입을 계획한다.
- **Personal-project simplicity**: PASS. JSON 파일 catalog와 단일 API surface만 사용하며 traffic-scale
  optimization은 제외한다.

## Project Structure

### Documentation (this feature)

```text
specs/002-project-selection/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── backend-api.md
│   └── web-ui.md
└── tasks.md
```

### Source Code (repository root)

```text
apps/backend/
├── src/
│   ├── domain/
│   │   └── project.ts
│   ├── application/
│   │   └── projects-service.ts
│   ├── ports/
│   │   └── project-repository.ts
│   ├── adapters/
│   │   ├── inbound/
│   │   │   └── http/
│   │   │       └── projects-routes.ts
│   │   └── outbound/
│   │       └── file-project-repository.ts
│   ├── config/
│   │   └── projects-catalog.ts
│   └── index.ts
├── data/
│   └── projects.json
└── tests/
    ├── unit/
    │   └── projects-service.test.ts
    └── integration/
        └── projects-routes.test.ts

apps/web/
├── components.json
├── src/
│   ├── app/
│   │   └── App.tsx
│   ├── pages/
│   │   └── project-selection/
│   ├── widgets/
│   │   └── project-workbench/
│   ├── features/
│   │   └── project-selection/
│   ├── entities/
│   │   └── project/
│   └── shared/
│       ├── api/
│       └── ui/
└── tests/
    └── project-selection.test.tsx
```

**Structure Decision**: 기존 `apps/web`과 `apps/backend` package를 유지한다. Backend는
Hexagonal Architecture를 보이도록 domain/application/ports/adapters 경계를 추가하고,
Frontend는 Feature-Sliced Design layer를 `projects` 관련 slice 중심으로 구성한다.
Tailwind CSS와 shadcn/ui는 `apps/web` 안에서 초기화하고, 이 feature에 필요한 UI primitive만
추가한다.

## Phase 0: Research

Research 결과는 [research.md](./research.md)에 기록했다. 모든 기술 선택과 unresolved
clarification은 resolution 되었으며, Constitution gate 위반은 없다.

## Phase 1: Design & Contracts

- 데이터 모델 및 상태 전이: [data-model.md](./data-model.md)
- Backend API contract: [contracts/backend-api.md](./contracts/backend-api.md)
- Web UI contract: [contracts/web-ui.md](./contracts/web-ui.md)
- 검증 quickstart: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **Korean spec documentation**: PASS. 모든 spec-related artifact prose는 한글로 작성했다.
- **Spec-first user value**: PASS. 설계 산출물은 P1/P2/P3 user story별 검증 흐름에 매핑된다.
- **Robust web behavior**: PASS. API/UI contract에 loading, empty, error, retry, missing value,
  stale selection 상태를 포함했다.
- **Fast user feedback**: PASS. 선택 변경과 오류 복구가 즉시 보이는 상태로 설계되었다.
- **Verification path**: PASS. Backend unit/integration test와 frontend 상태 검증, quickstart
  manual check가 정의되었다.
- **Frontend architecture**: PASS. Feature-Sliced Design layer와 shadcn/ui primitive 사용 범위가
  명확하다.
- **Backend architecture and tests**: PASS. Domain/application, port, inbound/outbound adapter와
  테스트 위치가 명확하다.
- **Personal-project simplicity**: PASS. JSON 파일 catalog와 단순 조회 API로 범위를 제한한다.

## Complexity Tracking

위반 사항 없음.
