# Quickstart: 프로젝트 선택 및 상세 조회 검증

## Prerequisites

- `pnpm install`이 완료되어 있어야 한다.
- 기본 Backend catalog JSON 파일은 `apps/backend/data/projects.json`이다.
- Backend catalog JSON 파일에 최소 1개 프로젝트가 등록되어 있어야 한다.
- Frontend shadcn/ui와 Tailwind CSS 초기화가 완료되어 있어야 한다.

## 개발 서버 실행

```bash
pnpm dev
```

또는 별도 terminal에서 실행한다.

```bash
pnpm --filter backend dev
pnpm --filter web dev
```

다른 catalog 파일을 검증하려면 backend 실행 전에 `PROJECTS_CATALOG_PATH`를 지정한다.

```bash
PROJECTS_CATALOG_PATH=/absolute/path/to/projects.json pnpm --filter backend dev
```

## Backend 확인

```bash
curl http://127.0.0.1:3000/health
curl http://127.0.0.1:3000/projects
curl http://127.0.0.1:3000/projects/spec-driven-workbench
```

기대 결과:

- `/health`는 기존 성공 상태를 반환한다.
- `/projects`는 `projects` 배열을 반환한다.
- 존재하는 프로젝트 상세 요청은 `project` 객체를 반환한다.
- 존재하지 않는 프로젝트 상세 요청은 `404`와 사용자가 이해할 수 있는 오류 메시지를 반환한다.

## Frontend 확인

1. 웹 앱을 브라우저에서 연다.
2. 프로젝트 목록 loading 상태가 표시되는지 확인한다.
3. 등록된 프로젝트 목록이 표시되는지 확인한다.
4. 프로젝트 하나를 선택한다.
5. 상세 영역에 이름, `path`, `git origin url`이 표시되는지 확인한다.
6. 다른 프로젝트를 선택하면 상세정보가 새 프로젝트로 갱신되는지 확인한다.

## Empty/Error 상태 확인

- catalog의 `projects`를 빈 배열로 바꾸면 빈 목록 안내가 표시되어야 한다.
- catalog 파일을 일시적으로 잘못된 형식으로 바꾸면 오류 메시지와 retry action이 표시되어야 한다.
- 상세 요청 대상 프로젝트를 catalog에서 제거하면 선택 해제 또는 재선택 안내가 표시되어야 한다.
- `gitOriginUrl`이 없는 프로젝트를 선택하면 상세 영역에 `값 없음` 표시가 보여야 한다.

## Quality Checks

```bash
pnpm typecheck
pnpm build
pnpm --filter backend test
pnpm --filter web test
```

Backend test framework가 구현 전에는 없으므로, tasks 단계에서 Vitest 도입 task가 backend 구현
task보다 먼저 배치되어야 한다.
