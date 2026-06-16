# Research: 프로젝트 선택 및 상세 조회

## Decision: Backend catalog는 JSON 파일 기반 repository adapter로 읽는다

**Rationale**: Spec은 백엔드에 JSON 파일로 저장된 항목을 표시하도록 요구한다. 개인용
workbench 범위에서는 데이터베이스보다 JSON 파일이 단순하고, Hexagonal Architecture에서는
파일 접근을 outbound adapter로 격리하면 이후 저장소 교체도 가능하다.

**Alternatives considered**:

- In-memory fixture: 빠르지만 사용자 요청의 JSON 파일 저장 요구를 충족하지 못한다.
- Database: 현재 범위의 목록/상세 조회에는 과도하며 setup 비용이 크다.
- Frontend bundled JSON: 백엔드가 프로젝트 정보를 제공해야 한다는 요구와 맞지 않는다.

## Decision: Backend는 ProjectRepository port와 ProjectsService application service를 둔다

**Rationale**: Constitution은 backend core logic이 framework, transport, persistence에 직접
의존하지 않도록 요구한다. `ProjectRepository` port와 `ProjectsService`는 프로젝트 목록,
상세 조회, 누락값 처리, 존재하지 않는 프로젝트 처리 규칙을 Hono route와 파일 시스템에서
분리한다.

**Alternatives considered**:

- Hono route에서 JSON 파일 직접 읽기: 구현은 짧지만 adapter 경계와 unit test가 약해진다.
- Repository 없이 helper 함수만 사용: 초기에는 가능하지만 상세 조회와 오류 변환 규칙이
  늘어날 때 테스트 경계가 흐려진다.

## Decision: Backend test framework는 Vitest를 도입한다

**Rationale**: 현재 backend에는 test framework가 없다. Constitution은 backend 구현보다 unit
test와 integration test 계획을 우선 요구한다. Vitest는 TypeScript, ESM, Node 환경과 잘 맞고
작은 package에 가볍게 적용할 수 있다.

**Alternatives considered**:

- Node built-in test runner: 추가 의존성은 적지만 mocking, assertion ergonomics가 Vitest보다
  낮다.
- Jest: 성숙하지만 ESM/TypeScript 설정 비용이 더 크다.
- 수동 테스트만 수행: Constitution의 backend test 기준을 충족하지 못한다.

## Decision: Frontend는 Feature-Sliced Design으로 project selection slice를 구성한다

**Rationale**: Constitution은 user-facing slice 단위 소유권과 dependency direction을 요구한다.
프로젝트 선택 기능은 `entities/project`, `features/project-selection`, `widgets/project-workbench`,
`pages/project-selection`, `shared/api`로 나누면 목록 조회, 선택 상태, 상세 표시의 책임이
분명해진다.

**Alternatives considered**:

- 기존 `App.tsx` 단일 파일 확장: 작은 기능에는 빠르지만 slice 경계와 반복 검증이 약해진다.
- 라우터 도입: 현재는 단일 화면이므로 별도 routing dependency가 필요하지 않다.

## Decision: Tailwind CSS와 shadcn/ui는 `apps/web`에 초기화하고 필요한 primitive만 추가한다

**Rationale**: shadcn CLI 확인 결과 현재 `components.json`과 Tailwind 설정이 없다. Constitution은
Tailwind CSS와 shadcn/ui 사용을 요구하므로 frontend 구현 전에 초기화가 필요하다. 목록, 상세,
feedback에는 `Button`, `Card`, `Badge`, `Alert`, `Skeleton`, `Empty` 계열 primitive가 적합하다.

**Alternatives considered**:

- 기존 CSS 유지: Constitution의 Tailwind/shadcn/ui 요구를 충족하지 못한다.
- UI library 대량 도입: 개인용 범위에 비해 불필요하게 크다.

## Decision: API는 목록 조회와 상세 조회를 분리한다

**Rationale**: Spec은 백엔드가 프로젝트 정보의 목록과 상세를 제공한다고 명시한다. 목록은 선택
UI에 필요한 기본 정보를 제공하고, 상세 endpoint는 선택 후 검증에 필요한 값을 안정적으로
제공한다.

**Alternatives considered**:

- 목록 endpoint 하나에 모든 상세정보 포함: 초기 구현은 단순하지만 "목록/상세" contract가
  흐려진다.
- 상세 endpoint만 제공: 사용자가 선택 가능한 프로젝트 목록을 확인할 수 없다.
