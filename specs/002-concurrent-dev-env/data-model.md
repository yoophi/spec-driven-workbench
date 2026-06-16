# Data Model: 중복 실행 가능한 개발환경

이 feature는 persistent data를 추가하지 않는다. 아래 모델은 root dev 유틸리티가
runtime에 관리하는 process/session 상태를 정의한다.

## Entity: DevSession

**Purpose**: root `pnpm run dev` 한 번으로 시작되는 local 개발환경 실행 단위.

**Fields**:

- `workspaceRoot`: 실행이 시작된 repository root absolute path
- `backend`: `ProcessState`
- `frontend`: `ProcessState`
- `backendBaseUrl`: frontend에 전달할 전체 backend base URL
- `startedAt`: session start timestamp
- `status`: `starting | ready | partial-failure | failed | stopped`

**Validation Rules**:

- `backendBaseUrl`은 scheme, host, port를 모두 포함해야 한다.
- `status=ready`가 되려면 backend와 frontend가 모두 running 상태여야 한다.
- `status=partial-failure`는 하나 이상의 process가 running이고 하나 이상이 failed일 때만
  사용할 수 있다.

## Entity: ProcessState

**Purpose**: backend 또는 frontend child process의 lifecycle을 표현한다.

**Fields**:

- `name`: `backend | frontend`
- `command`: 실행된 package command
- `env`: process에 전달된 주요 environment values
- `pid`: child process id
- `status`: `pending | running | failed | exited`
- `exitCode`: 종료된 경우 exit code
- `message`: 사용자에게 표시할 상태 또는 오류 설명

**Validation Rules**:

- `pid`는 process가 spawn된 뒤에만 존재한다.
- `failed` 상태는 사용자에게 표시 가능한 `message`를 포함해야 한다.
- Frontend `env`에는 backend port를 포함한 `VITE_API_BASE_URL`이 포함되어야 한다.

## Entity: BackendPortSelection

**Purpose**: backend가 사용할 port 결정 결과.

**Fields**:

- `preferredPort`: 기본 backend port
- `selectedPortMode`: `preferred | os-assigned`
- `selectedPort`: backend listen callback에서 확인된 실제 port
- `hostname`: backend listen hostname
- `reason`: 기본 port를 사용하지 않은 이유

**Validation Rules**:

- 기본 port가 사용 가능하면 `selectedPortMode=preferred`가 되어야 한다.
- 기본 port가 사용 중이면 `selectedPortMode=os-assigned`가 되어야 한다.
- `selectedPort`는 backend readiness output에서 확인된 값이어야 한다.

## Entity: RuntimeEnvContract

**Purpose**: backend와 frontend process 사이의 runtime configuration handoff.

**Fields**:

- `PORT`: backend에 전달되는 port value
- `HOST`: backend hostname
- `VITE_API_BASE_URL`: frontend에 전달되는 backend base URL

**Validation Rules**:

- `VITE_API_BASE_URL`은 backend readiness 이후에만 확정된다.
- `VITE_API_BASE_URL`은 실제 backend listen host/port와 일치해야 한다.

## State Transitions

```text
starting
  -> backend pending
  -> backend running
  -> frontend pending
  -> frontend running
  -> ready

starting
  -> backend failed
  -> failed

ready
  -> backend exited or frontend exited
  -> partial-failure or stopped

partial-failure
  -> all processes stopped
  -> stopped
```

## Non-Persistent Data

- Port selection result
- Child process pid
- Terminal status message
- Readiness output line

이 정보는 실행 중인 session 안에서만 유효하며 repository에 저장하지 않는다.
