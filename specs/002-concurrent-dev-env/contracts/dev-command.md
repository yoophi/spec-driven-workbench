# Contract: root `pnpm run dev`

## Purpose

개발자는 프로젝트 root에서 `pnpm run dev`만 실행해 backend와 frontend 개발 서버를 함께
시작한다. 명령은 backend port 충돌을 자동 처리하고 frontend에 실제 backend base URL을
전달한다.

## Command

```bash
pnpm run dev
```

## Expected Flow

1. Root dev 유틸리티가 backend 기본 port 사용 가능 여부를 확인한다.
2. 기본 port가 사용 가능하면 backend를 기본 port로 시작한다.
3. 기본 port가 이미 사용 중이면 backend를 OS-assigned port mode로 시작한다.
4. Backend stdout에서 실제 listening URL을 감지한다.
5. 감지한 URL을 `VITE_API_BASE_URL`로 frontend dev server에 전달한다.
6. Backend와 frontend URL을 terminal에 표시한다.
7. 사용자가 종료 signal을 보내면 두 child process를 함께 종료한다.

## Terminal Output Requirements

명령은 다음 정보를 개발자가 식별할 수 있게 표시해야 한다.

- Backend 시작 대기 상태
- Backend 기본 port 사용 여부 또는 자동 대체 여부
- Backend 실제 base URL
- Frontend 시작 대기 상태
- Frontend local URL
- 실패한 구성요소 이름과 복구 action

## Success Conditions

- Backend 기본 port가 비어 있으면 backend는 기본 port로 실행된다.
- Backend 기본 port가 사용 중이면 backend는 다른 port로 자동 실행된다.
- Frontend process는 backend 실제 base URL을 `VITE_API_BASE_URL`로 전달받는다.
- 동시에 실행된 다른 작업 디렉터리의 dev session과 port 충돌로 실패하지 않는다.

## Failure Conditions

- Backend process가 readiness 전에 종료되면 frontend를 시작하지 않고 backend failure를
  표시한다.
- Frontend process가 시작 실패하면 backend URL과 frontend failure를 함께 표시한다.
- 사용자가 종료하면 실행 중인 child process에 종료 signal을 전달한다.

## Verification

- Unit test: backend listening output에서 base URL을 추출한다.
- Unit test: 기본 port availability 결과에 따라 backend `PORT` 값이 결정된다.
- Integration test: 기본 backend port를 점유한 상태에서 `pnpm run dev`를 실행하면
  backend가 다른 port로 시작되고 frontend env에 해당 URL이 전달된다.
