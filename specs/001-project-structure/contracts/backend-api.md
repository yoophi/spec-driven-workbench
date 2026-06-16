# Contract: Backend REST API

## GET `/health`

백엔드 서버가 실행 중이며 요청을 받을 수 있는지 확인한다.

### Request

```http
GET /health HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
```

### Success Response

```http
HTTP/1.1 200 OK
Content-Type: application/json
```

```json
{
  "status": "ok",
  "service": "backend"
}
```

### Error Behavior

- 서버가 실행 중이지 않으면 요청은 connection error로 실패한다.
- port 충돌로 서버가 시작되지 못하면 backend dev command output에서 원인을 확인할 수 있어야 한다.
- 응답 body는 JSON parse가 가능해야 한다.

### Verification

- API 서버 실행 후 `http://127.0.0.1:3000/health` 요청이 1초 이내 성공 응답을 반환해야 한다.
- 웹 앱은 이 endpoint를 사용해 API 연결 상태를 표시할 수 있어야 한다.
