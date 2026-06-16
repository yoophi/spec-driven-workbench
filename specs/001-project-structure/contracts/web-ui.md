# Contract: Web UI

## 기본 화면

웹 앱의 첫 화면은 개발자가 앱 실행 상태와 API 연결 상태를 빠르게 확인할 수 있게 한다.

### Required Visible Content

- 프로젝트 또는 앱 이름
- 웹 앱 실행 성공 상태
- API 연결 확인 상태

### API Feedback States

- `loading`: API 연결 확인 중임을 표시한다.
- `success`: `/health` 응답 성공과 service 정보를 표시한다.
- `failure`: API 연결 실패 원인 또는 재시도 가능한 상태를 표시한다.

### Interaction Rules

- 새로고침 후에도 기본 화면이 오류 없이 다시 표시되어야 한다.
- API 서버가 꺼져 있어도 웹 앱 자체는 렌더링되어야 한다.
- 실패 메시지는 개발자가 backend 실행 여부를 확인할 수 있는 방향을 제공해야 한다.

### Verification

- 웹 dev server 실행 후 2초 이내 기본 화면이 표시되어야 한다.
- backend가 실행 중이면 API 연결 성공 상태가 표시되어야 한다.
- backend가 실행 중이지 않으면 API 연결 실패 상태가 표시되어야 한다.
