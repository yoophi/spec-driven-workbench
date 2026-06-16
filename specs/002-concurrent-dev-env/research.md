# Research: 중복 실행 가능한 개발환경

## Decision: root dev 유틸리티가 backend를 먼저 시작하고 readiness 이후 frontend를 시작한다

**Rationale**: Frontend는 backend port를 포함한 전체 base URL을 시작 시점에
`VITE_API_BASE_URL`로 받아야 한다. 따라서 root `pnpm run dev`가 backend를 먼저 실행하고
backend가 실제 listening 상태가 된 뒤 frontend process를 시작해야 한다.

**Alternatives considered**:

- `pnpm -r --parallel dev` 유지: 두 process가 독립 실행되어 backend URL을 frontend에
  안정적으로 전달할 수 없다.
- Frontend가 runtime에 backend port를 탐색: browser 환경에서 local process 탐색은
  부적절하고 사용자에게 보이는 실패 상태가 늦어진다.

## Decision: backend 기본 포트가 사용 중이면 `PORT=0`으로 OS가 포트를 할당하게 한다

**Rationale**: 기본 포트가 비어 있으면 기존 경험을 유지하고, 사용 중이면 운영체제의
ephemeral port allocation을 사용해 race condition을 줄인다. Backend는 이미 listen
callback에서 실제 port를 출력하므로 root 유틸리티가 이 값을 읽어 frontend base URL을
구성할 수 있다.

**Alternatives considered**:

- root 유틸리티가 임의 포트를 미리 찾아 전달: 포트 탐색과 실제 backend bind 사이의
  짧은 race condition이 남는다.
- 고정 fallback port 사용: 여러 작업 디렉터리를 동시에 실행하면 fallback port도 쉽게
  충돌한다.
- 사용자가 `.env`를 직접 수정: spec의 "추적되는 설정 파일 수동 수정 불필요" 요구와
  맞지 않는다.

## Decision: backend readiness는 stdout의 listening URL을 계약으로 삼는다

**Rationale**: 현재 backend는 `backend server listening on http://<host>:<port>` 형태로
실제 URL을 출력한다. 별도 IPC나 파일 기반 handoff를 추가하지 않아도 root 유틸리티가
readiness와 base URL을 동시에 알 수 있다.

**Alternatives considered**:

- 임시 JSON 파일로 port 전달: 작업 디렉터리별 파일 cleanup과 stale file 처리가 필요해
  단순성이 낮아진다.
- HTTP polling만 사용: polling 대상 URL을 알기 위해 port 결정이 먼저 필요하다.

## Decision: root dev 유틸리티는 Node.js built-in module만 사용한다

**Rationale**: 필요한 기능은 process spawn, stdout parsing, TCP port availability check,
signal forwarding이다. Node.js built-in `child_process`, `net`, `readline`, `process`로
충분하며 새 runtime dependency를 추가하지 않아 개인 프로젝트 단순성을 유지한다.

**Alternatives considered**:

- `concurrently`, `npm-run-all`, `wait-on` 도입: 편리하지만 backend port handoff와
  failure handling을 결국 custom code로 보완해야 한다.
- shell script 구현: cross-platform signal handling과 stdout parsing이 Node.js보다
  취약하다.

## Decision: 테스트는 Node.js test runner 기반 unit/integration으로 구성한다

**Rationale**: root dev 유틸리티는 Node.js built-in 중심이므로 Node.js test runner로
port selection, URL parsing, env propagation을 별도 dependency 없이 검증할 수 있다.
Integration test는 기본 backend port를 의도적으로 점유한 뒤 root 유틸리티가 다른
backend URL을 frontend env로 전달하는지 확인한다.

**Alternatives considered**:

- 수동 quickstart만 사용: port collision은 regression 위험이 높아 자동 테스트로
  보강해야 한다.
- browser E2E 도입: 이번 feature의 핵심은 process orchestration이며 browser 동작은
  기존 health UI manual check로 충분하다.
