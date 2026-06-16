# Contract: runtime environment handoff

## Backend Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `HOST` | No | Backend listen host. 없으면 기존 기본값을 사용한다. |
| `PORT` | Yes | Backend listen port. 기본 port가 사용 중이면 OS-assigned mode를 나타내는 값이 전달된다. |

## Backend Readiness Output

Backend는 readiness 시점에 실제 base URL을 포함한 한 줄을 출력해야 한다.

```text
backend server listening on http://127.0.0.1:<actual-port>
```

Root dev 유틸리티는 이 줄에서 `http://127.0.0.1:<actual-port>`를 추출한다.

## Frontend Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_BASE_URL` | Yes | Backend readiness output에서 확인한 전체 backend base URL |

## Invariants

- `VITE_API_BASE_URL`은 backend가 실제로 listening 상태가 되기 전에는 frontend에
  전달하지 않는다.
- `VITE_API_BASE_URL`은 scheme, hostname, port를 모두 포함한다.
- 동시에 실행되는 두 dev session의 `VITE_API_BASE_URL`은 각각 자신이 시작한 backend를
  가리켜야 한다.

## Error Reporting

- Backend readiness output을 제한 시간 안에 감지하지 못하면 backend startup failure로
  보고한다.
- Backend output에서 URL을 parsing할 수 없으면 contract violation으로 보고하고
  frontend를 시작하지 않는다.
- Frontend process 시작 실패 시 전달하려던 `VITE_API_BASE_URL`을 함께 표시한다.
