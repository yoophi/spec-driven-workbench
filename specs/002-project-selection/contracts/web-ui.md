# Web UI Contract: 프로젝트 선택 및 상세 조회

## Screen: Project Selection

사용자는 단일 화면에서 등록 프로젝트 목록을 확인하고 하나를 선택한 뒤 상세정보를 본다.

## Layout Regions

| Region | Purpose |
|--------|---------|
| Header | Workbench 이름과 현재 화면 맥락 표시 |
| Project List | 등록 프로젝트 목록, loading, empty, error 상태 표시 |
| Project Detail | 선택 프로젝트의 이름, `path`, `git origin url` 표시 |
| Feedback Area | retry, missing value, 선택 해제 등 사용자 행동 안내 |

## User Interactions

### 목록 불러오기

- 화면 진입 시 프로젝트 목록을 요청한다.
- 요청 중에는 shadcn/ui `Skeleton` 또는 동등한 loading primitive를 표시한다.
- 성공하면 project list를 표시한다.
- 목록이 비어 있으면 shadcn/ui `Empty` 계열 상태로 등록 프로젝트가 없음을 안내한다.
- 실패하면 shadcn/ui `Alert`와 retry `Button`을 표시한다.

### 프로젝트 선택

- 사용자는 목록 항목을 클릭하거나 keyboard로 focus 후 선택할 수 있다.
- 선택된 항목은 시각적으로 구분되고 assistive technology가 선택 상태를 알 수 있어야 한다.
- 선택 후 상세정보 loading 상태가 표시된다.
- 상세정보가 성공하면 이름, `path`, `git origin url`을 표시한다.
- `git origin url`이 없으면 "값 없음" 또는 이에 준하는 명확한 문구를 표시한다.

### 다른 프로젝트 선택

- 새 항목을 선택하면 기존 상세정보는 새 상세 loading 상태로 전환된다.
- 새 상세정보가 도착하면 상세 영역은 새 프로젝트 기준으로 갱신된다.

### 오류와 복구

- 목록 조회 실패: 오류 메시지와 retry button을 표시한다.
- 상세 조회 실패: 상세 영역에 오류 메시지와 retry button을 표시한다.
- 상세 `404`: 선택 프로젝트가 더 이상 등록되어 있지 않음을 알리고 최신 목록 기준 재선택을 안내한다.

## Accessibility Requirements

- 목록 항목은 keyboard로 접근하고 선택할 수 있어야 한다.
- 선택 상태는 visible focus와 accessible state로 확인 가능해야 한다.
- 오류 메시지는 readable text로 제공되어야 한다.
- loading과 완료 feedback은 `aria-live` 또는 적절한 status region으로 전달되어야 한다.

## Frontend Architecture Contract

- `entities/project`: Project 타입, 표시 label, 누락값 helper를 소유한다.
- `shared/api`: backend project API client와 error normalization을 소유한다.
- `features/project-selection`: 선택 상태와 선택 action을 소유한다.
- `widgets/project-workbench`: 목록과 상세 영역을 조합한다.
- `pages/project-selection`: feature 화면 entry를 제공한다.
- `shared/ui`: shadcn/ui primitive와 공통 UI helper만 둔다.

## shadcn/ui Candidate Components

- `Button`: retry action
- `Card`: 상세정보 영역
- `Badge`: 선택 상태 또는 값 없음 보조 표시
- `Alert`: 오류 메시지
- `Skeleton`: loading placeholder
- `Empty`: 빈 목록 상태
