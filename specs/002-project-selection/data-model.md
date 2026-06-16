# Data Model: 프로젝트 선택 및 상세 조회

## Entity: Project

사용자가 실행 대상으로 선택할 수 있는 등록 프로젝트 항목이다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | 프로젝트를 안정적으로 식별하는 내부 식별자 |
| `name` | string | Yes | 목록과 상세 화면에 표시되는 프로젝트 이름 |
| `path` | string | Yes | 로컬 파일 시스템상의 프로젝트 경로 |
| `gitOriginUrl` | string | No | 프로젝트의 `git origin url`; 없으면 값 없음으로 표시 |

### Validation Rules

- `id`는 비어 있으면 안 되며 catalog 안에서 유일해야 한다.
- `name`은 비어 있으면 안 된다.
- `path`는 비어 있으면 안 된다.
- `gitOriginUrl`은 선택값이다. 비어 있거나 누락되면 UI는 값 없음 상태로 표시한다.
- 같은 `name`을 가진 프로젝트가 있어도 허용하되, `path`로 구분할 수 있어야 한다.

## Entity: ProjectCatalog

백엔드 JSON 파일에 저장된 프로젝트 등록 목록이다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `projects` | Project[] | Yes | 등록 프로젝트 목록 |

### Validation Rules

- `projects`가 없거나 배열이 아니면 catalog 읽기 실패로 처리한다.
- 유효하지 않은 항목은 사용자가 오해하지 않도록 실패 상태로 드러낸다.
- catalog가 비어 있으면 정상 empty state로 처리한다.

## Entity: ProjectSelectionState

프론트엔드에서 사용자가 현재 선택한 프로젝트와 조회 상태를 나타낸다.

### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `listStatus` | `idle` \| `loading` \| `success` \| `empty` \| `error` | Yes | 목록 조회 상태 |
| `detailStatus` | `idle` \| `loading` \| `success` \| `missing` \| `error` | Yes | 상세 조회 상태 |
| `projects` | Project[] | Yes | 화면에 표시할 프로젝트 목록 |
| `selectedProjectId` | string | No | 현재 선택된 프로젝트 식별자 |
| `selectedProject` | Project | No | 상세정보가 확인된 프로젝트 |
| `errorMessage` | string | No | 사용자가 이해할 수 있는 오류 메시지 |

## State Transitions

```text
초기 진입
  -> listStatus: loading
  -> 성공 + projects.length > 0: listStatus success, selectedProjectId 없음
  -> 성공 + projects.length = 0: listStatus empty
  -> 실패: listStatus error, retry 가능

프로젝트 선택
  -> selectedProjectId 설정
  -> detailStatus loading
  -> 상세 성공: detailStatus success, selectedProject 표시
  -> 상세 404: detailStatus missing, 선택 해제 또는 재선택 안내
  -> 상세 실패: detailStatus error, retry 가능

다른 프로젝트 선택
  -> selectedProjectId 교체
  -> 기존 상세정보를 새 상세 로딩 상태로 전환
```

## Relationships

- `ProjectCatalog`는 여러 `Project`를 포함한다.
- `ProjectSelectionState.selectedProjectId`는 `Project.id`를 참조한다.
- `selectedProject`는 상세 조회 성공 후 `selectedProjectId`와 같은 `id`를 가진다.
