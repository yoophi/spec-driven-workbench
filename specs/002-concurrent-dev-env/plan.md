# Implementation Plan: 중복 실행 가능한 개발환경

**Branch**: `002-concurrent-dev-env` | **Date**: 2026-06-17 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/002-concurrent-dev-env/spec.md`

## Summary

프로젝트 root에서 `pnpm run dev` 한 번만 실행해 backend와 frontend 개발 서버를 함께
시작한다. Backend 기본 포트가 비어 있으면 기존 기본값을 사용하고, 이미 사용 중이면
운영체제가 할당한 사용 가능한 포트로 자동 전환한다. Root dev 유틸리티는 backend가
실제로 listening 상태가 된 뒤 전체 backend base URL을 `VITE_API_BASE_URL`로 frontend
개발 서버에 전달해, 여러 작업 디렉터리의 개발환경이 서로 충돌하지 않고 실행되도록
한다.

## Technical Context

**Language/Version**: TypeScript, JavaScript ESM, Node.js LTS 계열  
**Primary Dependencies**: pnpm workspace, React, Vite, Hono, `@hono/node-server`,
Node.js built-in `child_process`, `net`, `readline`, `process`  
**Storage**: N/A  
**Testing**: root dev utility unit tests with Node.js test runner, integration test
for occupied backend default port, existing `pnpm run typecheck` and `pnpm run build`  
**Target Platform**: local development machine, latest local browser, Node.js runtime  
**Project Type**: pnpm monorepo web application; root developer tooling + SPA +
REST API server  
**Performance Goals**: 두 번째 개발환경도 5분 이내 실행 가능, backend readiness 감지
후 1초 이내 frontend 실행 시작, health 확인 1초 이내 응답  
**Constraints**: root에서 `pnpm run dev`만 사용, backend 기본 포트 사용 중이면 자동
대체 포트 할당, frontend에는 backend port를 포함한 전체 base URL 전달, 추적되는 설정
파일 수동 수정 불필요, Korean spec documentation 유지, traffic-scale optimization 제외  
**Scale/Scope**: 단일 개발자의 local personal workflow; 같은 machine에서 최소 두 개
작업 디렉터리 또는 실행 세션 동시 실행

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Korean spec documentation**: PASS. `plan.md`, `research.md`, `data-model.md`,
  `quickstart.md`, `contracts/*` prose는 한국어로 작성하고 command, env var, path,
  package name은 정확성을 위해 원문을 유지한다.
- **Spec-first user value**: PASS. 계획은 P1 동시 실행, P2 충돌 복구, P3 환경 구분
  user story와 SC-001~SC-004에 직접 연결된다.
- **Robust web behavior**: PASS. Backend readiness, startup failure, partial failure,
  occupied port, frontend env 전달 실패를 명시적으로 다룬다.
- **Fast user feedback**: PASS. Root dev 유틸리티는 pending, success, failure 상태와
  선택된 backend/frontend URL을 terminal에 표시한다.
- **Verification path**: PASS. Port selection unit test, occupied-port integration test,
  root `pnpm run dev` manual quickstart로 독립 검증한다.
- **Frontend architecture**: PASS. UI 변경은 필요하지 않다. Frontend 동작 변경은
  `VITE_API_BASE_URL` runtime configuration을 전달받는 기존 `apps/web` app/shared
  경계에 머문다. 새 UI component가 없으므로 Tailwind CSS/shadcn/ui 추가도 없다.
- **Backend architecture and tests**: PASS. Backend domain/API behavior는 변경하지
  않는다. Dev utility는 backend process를 실행하는 inbound CLI adapter 성격이며,
  port allocation과 readiness parsing은 framework-independent utility로 분리하고
  unit/integration test를 계획한다.
- **Personal-project simplicity**: PASS. Node.js built-in 기능과 기존 pnpm workspace만
  사용하며 container orchestration, process manager, distributed infrastructure는
  제외한다.

## Project Structure

### Documentation (this feature)

```text
specs/002-concurrent-dev-env/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── dev-command.md
│   └── runtime-env.md
└── tasks.md
```

### Source Code (repository root)

```text
package.json

scripts/
├── dev.mjs
└── dev-utils.mjs

tests/
├── integration/
│   └── dev-command.test.mjs
└── unit/
    └── dev-utils.test.mjs

apps/backend/
├── package.json
└── src/
    └── index.ts

apps/web/
├── package.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── main.tsx
    └── styles.css
```

**Structure Decision**: root `scripts/`에 dev orchestration entrypoint와 pure utility를
둔다. Backend와 frontend package는 product behavior를 유지하고, root `package.json`의
`dev` script만 orchestration entrypoint를 호출하도록 바꾼다. Test는 root `tests/`에
unit/integration으로 분리해 dev utility behavior를 backend/frontend 구현과 독립적으로
검증한다.

## Phase 0: Research

Research 결과는 [research.md](./research.md)에 기록했다. 모든 design decision은 현재
프로젝트 구조와 사용자 입력으로 확정되었고 unresolved clarification은 없다.

## Phase 1: Design & Contracts

- Runtime entity와 state transition: [data-model.md](./data-model.md)
- Root dev command contract: [contracts/dev-command.md](./contracts/dev-command.md)
- Runtime environment contract: [contracts/runtime-env.md](./contracts/runtime-env.md)
- 검증 quickstart: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **Korean spec documentation**: PASS. 모든 planning artifact prose는 한국어로 작성했다.
- **Spec-first user value**: PASS. Artifacts는 P1/P2/P3 user story와 acceptance scenario를
  검증 가능한 실행 계약으로 변환한다.
- **Robust web behavior**: PASS. Contracts와 quickstart가 occupied port, backend start
  failure, frontend start failure, partial failure recovery를 포함한다.
- **Fast user feedback**: PASS. Terminal output contract가 backend URL, frontend URL,
  pending/success/failure 메시지를 요구한다.
- **Verification path**: PASS. Unit test, integration test, manual quickstart가 각각
  port allocation, env propagation, 동시 실행을 검증한다.
- **Frontend architecture**: PASS. 새 UI slice는 없고 runtime config 전달만 검증한다.
- **Backend architecture and tests**: PASS. Backend API behavior 변경 없이 root CLI
  adapter와 utility tests로 dev-time behavior를 검증한다.
- **Personal-project simplicity**: PASS. Built-in Node.js 기능과 기존 workspace 명령으로
  구현 가능하며 과도한 infrastructure를 도입하지 않는다.

## Complexity Tracking

위반 사항 없음.
