<!--
Sync Impact Report
Version change: 1.1.0 -> 1.2.0
Modified principles:
- I. Spec-First User Value -> I. Spec-First User Value
- II. Robust Web Application Behavior -> II. Robust Web Application Behavior
- III. Fast User Feedback -> III. Fast User Feedback
- IV. Verifiable Quality Gates -> IV. Verifiable Quality Gates
- V. Personal-Project Simplicity -> V. Personal-Project Simplicity
- VI. Korean Spec Documentation -> VI. Korean Spec Documentation
Added principles:
- VII. Frontend Feature-Sliced UI Architecture
- VIII. Backend Hexagonal Architecture and Tests
Added sections:
- Frontend Architecture Constraints
- Backend Architecture Constraints
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/checklist-template.md
- ✅ .specify/templates/commands/*.md (not present)
Runtime guidance:
- ✅ AGENTS.md
Follow-up TODOs:
- None
-->
# Spec-Driven Workbench Constitution

## Core Principles

### I. Spec-First User Value
모든 feature는 구현 전에 사용자, 사용자에게 보이는 결과, acceptance scenario,
측정 가능한 success criteria를 포함한 written specification으로 시작해야 한다.
구현 세부사항은 spec에서 사용자 행동을 대체해서는 안 된다. 각 feature는 가장 높은
우선순위의 user story를 독립적으로 구현, 검토, 검증할 수 있도록 slice되어야 한다.

Rationale: 이 프로젝트는 spec-driven development를 연습하기 위한 workbench다.
검증 가능한 의도는 구현 선택이 사용자 가치와 계속 연결되게 한다.

### II. Robust Web Application Behavior
웹 application feature는 예상 가능한 loading, empty, error, validation, recovery
state를 처리해야 한다. 사용자 입력은 trust boundary에서 검증해야 한다. 핵심 flow는
silent failure, 모호한 destructive action, 사용자가 계속 진행할 수 없는 UI state를
남겨서는 안 된다.

Rationale: 개인용 작은 프로젝트라도 유용한 웹 application의 기본 품질 기준은
견고한 동작이다.

### III. Fast User Feedback
사용자 action은 적시에 보이는 feedback을 제공해야 한다. 오래 걸리는 operation은
progress, pending, completion state 중 적절한 상태를 보여야 한다. Error는 사용자가
무엇이 일어났고 다음에 어떤 action을 취할 수 있는지 이해할 수 있는 언어로 표시해야
한다.

Rationale: 빠른 feedback은 application을 신뢰 가능하게 만들고 반복 사용 중 실수의
비용을 낮춘다.

### IV. Verifiable Quality Gates
각 user story는 구현 전에 독립 verification path를 정의해야 한다. Core behavior는
test framework가 있는 경우 automated test로 검증해야 하며, framework가 없으면 plan에
manual quickstart check를 문서화해야 한다. Core flow에서 발견된 regression은 관련
fix가 완료되기 전에 automated test로 전환해야 한다.

Rationale: verification은 spec-driven work를 실제 품질 기준으로 연결하고 같은
failure를 수동으로 반복 발견하는 일을 막는다.

### V. Personal-Project Simplicity
프로젝트는 현재 spec을 지원하는 가장 단순한 architecture를 우선해야 한다.
Traffic-scale optimization, distributed infrastructure, caching layer, 단일 개인
사용자의 responsiveness를 넘어서는 performance work는 feature spec의 사용자 결과를
막는 측정된 local bottleneck이 없는 한 제외해야 한다.

Rationale: 이 프로젝트는 개인 프로젝트다. 복잡성은 가상의 traffic이 아니라 현재
product에 기여해야 한다.

### VI. Korean Spec Documentation
Spec-related document는 Korean prose로 작성해야 한다. Technical terms, code,
commands, identifiers, API paths, package names, quoted source text는 번역이 정확성을
낮추는 경우 원문을 유지할 수 있다.

Rationale: Korean spec은 owner가 프로젝트 의도를 더 쉽게 검토하고 유지하게 하며,
구현 정확성에 필요한 technical terminology는 보존한다.

### VII. Frontend Feature-Sliced UI Architecture
Frontend code는 Feature-Sliced Design 원칙에 따라 구성해야 한다. Feature code는
user-facing slice 단위로 소유권과 dependency direction을 드러내야 하며, shared UI와
domain-independent utility는 feature 내부 구현과 분리해야 한다. Frontend UI를 구성할
때는 Tailwind CSS와 shadcn/ui를 사용해야 하며, 새 component 또는 style pattern은
기존 token, utility, shadcn/ui primitive를 우선 재사용해야 한다.

Rationale: Feature-Sliced Design은 user story 단위 delivery와 유지보수 경계를
일치시킨다. Tailwind CSS와 shadcn/ui는 UI 구현을 일관되고 검토 가능하게 만든다.

### VIII. Backend Hexagonal Architecture and Tests
Backend code는 Hexagonal Architecture를 사용해야 한다. Core domain/application logic은
framework, transport, persistence, external service adapter에 직접 의존해서는 안 된다.
Inbound adapter, outbound adapter, port, application service, domain model의 경계는
feature plan과 source tree에서 확인 가능해야 한다. Backend code 변경은 unit test와
integration test를 우선 작성해야 하며, test framework가 없는 경우 해당 framework를
도입하는 task가 backend 구현보다 먼저 계획되어야 한다.

Rationale: Hexagonal Architecture는 backend business rule을 delivery mechanism과
분리해 테스트 가능성을 높인다. Unit test와 integration test는 adapter 경계와 핵심
flow를 모두 검증한다.

## Web Application Constraints

Plans and specs MUST define the target browser/runtime, primary user journeys,
state transitions, and failure states for web-facing work. Accessibility basics
MUST be included for interactive UI: semantic controls, keyboard reachability,
visible focus, and readable error text.

Performance criteria MUST focus on perceived responsiveness for the current
personal workflow. Requirements such as high concurrency, multi-region
deployment, or heavy traffic optimization are out of scope unless explicitly
justified by the feature spec.

## Frontend Architecture Constraints

Frontend plans MUST identify the affected Feature-Sliced Design layer or slice
for every user-facing change. New UI MUST use Tailwind CSS utilities and
shadcn/ui components or primitives unless the plan documents why an existing
primitive cannot express the required behavior.

Frontend tasks MUST keep cross-slice imports explicit and minimal. Shared code
MUST contain reusable primitives only; feature-specific behavior MUST remain in
the owning slice.

## Backend Architecture Constraints

Backend plans MUST identify domain/application code, inbound adapters, outbound
adapters, and ports for each backend change. Framework-specific code MUST remain
at adapter boundaries.

Backend tasks MUST include unit tests for domain/application behavior and
integration tests for adapter or API behavior before the implementation task is
considered complete.

## Documentation Language

The following spec-related artifacts MUST use Korean prose by default:

- `spec.md`
- `plan.md`
- `research.md`
- `data-model.md`
- `quickstart.md`
- `tasks.md`
- checklists generated for a feature

Technical terms and code-facing content MUST remain exact when needed for
implementation correctness.

## Development Workflow

Development proceeds in this order:

1. Write or update the feature specification.
2. Confirm acceptance scenarios, edge cases, and success criteria.
3. Produce an implementation plan with a Constitution Check.
4. Generate tasks grouped by independently verifiable user stories.
5. Implement the smallest valuable slice first.
6. Run the relevant automated tests or documented manual checks.

Any plan that violates a core principle MUST document the violation, the reason
it is necessary, and the simpler alternative that was rejected.

## Governance

This constitution supersedes conflicting repository practices. Amendments MUST
be made by updating this file and synchronizing affected templates and runtime
guidance in the same change.

Versioning follows semantic versioning:

- MAJOR: removes or redefines a principle in a way that changes prior decisions.
- MINOR: adds a principle, section, or materially expands governance.
- PATCH: clarifies wording without changing project obligations.

Every feature plan MUST include a Constitution Check before implementation. The
check MUST confirm spec-first scope, robust web behavior, fast user feedback,
verification approach, Korean spec documentation, Feature-Sliced Design,
Tailwind CSS and shadcn/ui usage for frontend UI, Hexagonal Architecture and
unit/integration tests for backend code, and avoidance of unnecessary
traffic-scale optimization.

**Version**: 1.2.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
