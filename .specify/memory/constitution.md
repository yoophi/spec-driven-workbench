<!--
Sync Impact Report
Version change: 1.0.0 -> 1.1.0
Modified principles:
- I. Spec-First User Value -> I. Spec-First User Value
- II. Robust Web Application Behavior -> II. Robust Web Application Behavior
- III. Fast User Feedback -> III. Fast User Feedback
- IV. Verifiable Quality Gates -> IV. Verifiable Quality Gates
- V. Personal-Project Simplicity -> V. Personal-Project Simplicity
Added sections:
- Documentation Language
Removed sections:
- None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
- ✅ .specify/templates/checklist-template.md
Runtime guidance:
- ✅ AGENTS.md
Follow-up TODOs:
- None
-->
# Spec-Driven Workbench Constitution

## Core Principles

### I. Spec-First User Value
Every feature MUST begin with a written specification that identifies the user,
the user-visible outcome, acceptance scenarios, and measurable success criteria.
Implementation details MUST NOT replace user behavior in the spec. Each feature
MUST be sliced so the highest-priority user story can be delivered, reviewed,
and validated independently.

Rationale: this project exists to practice spec-driven development. Written,
testable intent keeps implementation choices tied to user value.

### II. Robust Web Application Behavior
Web application features MUST handle expected loading, empty, error, validation,
and recovery states. User input MUST be validated at trust boundaries. Core
flows MUST avoid silent failures, ambiguous destructive actions, and UI states
that leave the user unable to continue.

Rationale: robustness is the default quality bar for a useful web application,
even when the project is personal and small.

### III. Fast User Feedback
User actions MUST provide timely visible feedback. Long-running operations MUST
show progress, pending, or completion state. Errors MUST be presented in language
that helps the user understand what happened and what action is available next.

Rationale: fast feedback makes the application feel dependable and reduces the
cost of mistakes during repeated personal use.

### IV. Verifiable Quality Gates
Each user story MUST define an independent verification path before
implementation begins. Core behavior MUST be covered by automated tests when the
project has a test framework; otherwise the plan MUST document a manual
quickstart check. Regressions found in core flows MUST be converted into
automated tests before the related fix is considered complete.

Rationale: verification keeps spec-driven work honest and prevents repeated
manual rediscovery of the same failures.

### V. Personal-Project Simplicity
The project MUST favor the simplest architecture that supports the current spec.
Traffic-scale optimization, distributed infrastructure, caching layers, and
performance work beyond responsiveness for a single personal user MUST be
deferred unless a measured local bottleneck blocks the stated user outcome.

Rationale: this is a personal project. Complexity must serve the product, not
hypothetical traffic.

### VI. Korean Spec Documentation
Spec-related documents MUST be written in Korean. Technical terms, code,
commands, identifiers, API paths, package names, and quoted source text MAY stay
in their original language when translation would reduce precision.

Rationale: Korean specs make project intent easier to review and maintain for
the owner while preserving exact technical terminology where needed.

## Web Application Constraints

Plans and specs MUST define the target browser/runtime, primary user journeys,
state transitions, and failure states for web-facing work. Accessibility basics
MUST be included for interactive UI: semantic controls, keyboard reachability,
visible focus, and readable error text.

Performance criteria MUST focus on perceived responsiveness for the current
personal workflow. Requirements such as high concurrency, multi-region
deployment, or heavy traffic optimization are out of scope unless explicitly
justified by the feature spec.

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
verification approach, Korean spec documentation, and avoidance of unnecessary
traffic-scale optimization.

**Version**: 1.1.0 | **Ratified**: 2026-06-16 | **Last Amended**: 2026-06-16
