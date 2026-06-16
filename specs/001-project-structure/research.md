# Research: 프로젝트 기본 구조 설정

## Decision: pnpm workspace 기반 모노레포 사용

**Rationale**: 사용자 입력에서 `pnpm` 기반 모노레포가 명시되었다. 두 앱을 같은
저장소에서 관리하면서도 package 단위 실행과 의존성 분리를 유지할 수 있다.

**Alternatives considered**: 단일 package 구조는 `apps/web`과 `apps/backend`의 독립
명령을 표현하기 어렵다. npm/yarn workspace는 사용자 지정과 다르므로 제외했다.

## Decision: `apps/web`에 React + TypeScript + Vite SPA 배치

**Rationale**: 사용자 입력에서 기술 stack과 경로가 명시되었다. Vite는 SPA 개발
서버와 build 확인이 단순하고, React + TypeScript는 UI 상태와 API 연결 상태를
명확히 표현하기에 충분하다.

**Alternatives considered**: Next.js 같은 full-stack framework는 이번 범위의 SPA
요구보다 크다. plain HTML/TS는 사용자가 지정한 React 요구를 충족하지 않는다.

## Decision: `apps/backend`에 Hono + TypeScript REST API 서버 배치

**Rationale**: 사용자 입력에서 Hono 기반 REST API server가 명시되었다. Hono는 작은
API 서버를 간결하게 구성할 수 있고 `/health` 같은 기본 endpoint 확인에 적합하다.

**Alternatives considered**: Express/Fastify는 사용자가 지정한 Hono 요구와 다르다.
서버 없는 mock만 두는 방식은 REST API 서버 실행 요구를 충족하지 않는다.

## Decision: 초기 검증은 typecheck, build, health 확인 중심으로 구성

**Rationale**: 이 feature는 기본 구조 설정이므로 복잡한 test framework보다
typecheck/build와 quickstart 확인이 더 직접적이다. 이후 기능이 추가되면 테스트
framework를 확장한다.

**Alternatives considered**: 초기부터 E2E test runner를 도입하는 방식은 개인용
프로젝트 기본 구조 범위에 비해 과하다.

## Decision: 트래픽 규모 최적화 제외

**Rationale**: constitution과 spec 모두 개인용 프로젝트이며 트래픽 최적화가 필요
없다고 명시한다. 로컬 실행 responsiveness만 성공 기준으로 삼는다.

**Alternatives considered**: caching, queue, multi-process server, CDN 설정은 측정된
병목 없이 추가하지 않는다.

## Implementation Review: 트래픽 규모 최적화 없음

**Rationale**: 구현 결과는 `pnpm` workspace, `apps/web` SPA, `apps/backend` REST API
서버, typecheck/build/health 확인으로 제한된다. caching, queue, CDN, multi-region
deployment, load balancing 같은 트래픽 규모 최적화는 추가하지 않았다.

**Alternatives considered**: 개인용 로컬 개발 구조에서는 운영 인프라 최적화보다
명확한 실행 명령과 빠른 상태 피드백이 더 직접적인 가치다.
