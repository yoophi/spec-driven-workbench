# Implementation Plan: 프로젝트 기본 구조 설정

**Branch**: `001-project-structure` | **Date**: 2026-06-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-project-structure/spec.md`

## Summary

`pnpm` workspace 기반 모노레포를 구성하고, `apps/web`에는 React + TypeScript +
Vite 기반 SPA를, `apps/backend`에는 Hono + TypeScript 기반 REST API 서버를
배치한다. 초기 목표는 개인 개발자가 새 checkout 후 빠르게 설치, 실행, 검증할 수
있는 구조와 명령 체계를 제공하는 것이다.

## Technical Context

**Language/Version**: TypeScript, Node.js LTS 계열  
**Primary Dependencies**: pnpm workspace, TypeScript, React, Vite, Hono  
**Storage**: N/A  
**Testing**: TypeScript typecheck, Vite build, backend typecheck/build, `/health` 수동 확인  
**Target Platform**: 로컬 개발 환경의 최신 브라우저와 Node.js runtime  
**Project Type**: pnpm monorepo web application; SPA + REST API server  
**Performance Goals**: 로컬에서 웹 기본 화면 2초 이내 표시, health 응답 1초 이내 반환  
**Constraints**: spec 문서는 한글 작성, `apps/web` 및 `apps/backend` 경로 고정,
트래픽 규모 최적화 제외  
**Scale/Scope**: 개인용 로컬 개발 기본 구조; 배포, 인증, DB, 외부 서비스 연동 제외

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **Korean spec documentation**: PASS. `plan.md`, `research.md`, `data-model.md`,
  `quickstart.md`, contract 문서는 한글 prose로 작성하고 기술 용어와 경로는 원문을 유지한다.
- **Spec-first user value**: PASS. 계획은 P1 설치/workspace 확인, P2 SPA 실행,
  P3 REST API 실행 user story와 success criteria에 직접 연결된다.
- **Robust web behavior**: PASS. 웹 앱은 loading, success, failure API 연결 상태를
  표시하고 backend는 `/health` 실패 원인을 로그로 확인할 수 있게 한다.
- **Fast user feedback**: PASS. 개발 명령, 웹 화면, API health 응답 모두 빠른
  확인 경로를 제공한다.
- **Verification path**: PASS. 각 user story는 typecheck/build 또는 quickstart
  수동 확인으로 독립 검증된다.
- **Personal-project simplicity**: PASS. 단일 workspace와 두 앱만 구성하며 caching,
  queue, distributed deployment, traffic tuning은 제외한다.

## Project Structure

### Documentation (this feature)

```text
specs/001-project-structure/
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
package.json
pnpm-workspace.yaml
tsconfig.base.json

apps/
├── web/
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       └── styles.css
└── backend/
    ├── package.json
    ├── tsconfig.json
    └── src/
        └── index.ts
```

**Structure Decision**: pnpm workspace root 아래 `apps/web`과 `apps/backend`를
독립 package로 둔다. 공통 설정은 루트에 최소한으로 두고, 앱별 실행과 build 명령은
각 package에 둔다.

## Phase 0: Research

Research 결과는 [research.md](./research.md)에 기록했다. 모든 기술 선택은 사용자
입력과 feature spec에서 확정되었고 unresolved clarification은 없다.

## Phase 1: Design & Contracts

- 데이터 모델 및 구조 정의: [data-model.md](./data-model.md)
- REST API contract: [contracts/backend-api.md](./contracts/backend-api.md)
- Web UI contract: [contracts/web-ui.md](./contracts/web-ui.md)
- 검증 quickstart: [quickstart.md](./quickstart.md)

## Post-Design Constitution Check

- **Korean spec documentation**: PASS. 모든 산출물 prose는 한글로 작성했다.
- **Spec-first user value**: PASS. artifacts가 spec의 P1/P2/P3 흐름에 매핑된다.
- **Robust web behavior**: PASS. UI/API contract에 기본 성공/실패 피드백을 포함했다.
- **Fast user feedback**: PASS. quickstart가 설치, 실행, 확인 명령을 짧은 순서로 제공한다.
- **Verification path**: PASS. 각 user story별 확인 명령과 기대 결과가 있다.
- **Personal-project simplicity**: PASS. 트래픽 규모 최적화나 과도한 인프라는 추가하지 않았다.

## Complexity Tracking

위반 사항 없음.
