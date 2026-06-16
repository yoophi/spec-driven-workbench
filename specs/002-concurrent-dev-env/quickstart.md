# Quickstart: 중복 실행 가능한 개발환경 검증

## Prerequisites

- Repository dependencies가 설치되어 있어야 한다.
- 두 개의 독립 작업 디렉터리 또는 같은 repository의 두 terminal session을 사용할 수
  있어야 한다.

## 1. 기본 실행 확인

```bash
pnpm run dev
```

Expected:

- Backend URL이 terminal에 표시된다.
- Frontend URL이 terminal에 표시된다.
- Frontend가 표시한 API 연결 상태가 성공으로 전환된다.

## 2. Backend 기본 port 점유 상황 확인

첫 번째 terminal에서 개발환경을 실행한 채로 둔다.

```bash
pnpm run dev
```

두 번째 독립 작업 디렉터리 또는 두 번째 terminal에서 같은 명령을 실행한다.

Expected:

- 두 번째 실행은 backend 기본 port 충돌로 실패하지 않는다.
- 두 번째 backend는 첫 번째 backend와 다른 port를 사용한다.
- 두 번째 frontend는 두 번째 backend의 전체 base URL을 사용한다.
- 두 frontend 화면 모두 API 연결 성공 상태를 표시한다.

## 3. Environment handoff 확인

두 번째 실행의 terminal output에서 backend base URL을 확인한다.

Expected:

- Frontend failure 메시지나 표시된 API base URL이 첫 번째 backend URL을 가리키지 않는다.
- Backend health 확인은 두 번째 terminal에 표시된 URL로 성공한다.

```bash
curl <second-backend-base-url>/health
```

## 4. 종료 확인

각 terminal에서 종료 signal을 보낸다.

Expected:

- Backend와 frontend child process가 함께 종료된다.
- 다시 `pnpm run dev`를 실행하면 stale process나 stale file 때문에 실패하지 않는다.

## Automated Checks

```bash
pnpm run typecheck
pnpm run build
pnpm test
```

Expected:

- Typecheck와 build가 통과한다.
- Unit test는 URL parsing과 port selection을 검증한다.
- Integration test는 backend 기본 port를 점유한 상황에서 자동 port 대체와 frontend env
  전달을 검증한다.
