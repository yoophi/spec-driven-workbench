# Backend API Contract: 프로젝트 선택 및 상세 조회

## Overview

Backend는 등록된 프로젝트 catalog를 읽어 프로젝트 목록과 상세정보를 제공한다. 응답은
프론트엔드가 loading, empty, error, retry, 상세 표시 상태를 명확히 구성할 수 있어야 한다.

## GET `/projects`

등록된 프로젝트 목록을 반환한다.

### Success Response: `200 OK`

```json
{
  "projects": [
    {
      "id": "spec-driven-workbench",
      "name": "Spec Driven Workbench",
      "path": "/Users/yoophi/project/spec-driven-workbench",
      "gitOriginUrl": "git@github.com:yoophi/spec-driven-workbench.git"
    }
  ]
}
```

### Empty Response: `200 OK`

```json
{
  "projects": []
}
```

### Error Response: `500 Internal Server Error`

```json
{
  "error": {
    "code": "PROJECT_CATALOG_UNAVAILABLE",
    "message": "등록된 프로젝트 목록을 불러올 수 없습니다."
  }
}
```

### Contract Rules

- `projects`는 항상 배열이다.
- 각 project는 `id`, `name`, `path`를 포함해야 한다.
- `gitOriginUrl`은 없거나 빈 값일 수 있으며, 프론트엔드는 값 없음으로 표시한다.
- catalog 파일을 읽을 수 없거나 형식이 유효하지 않으면 `500`과 사용자 친화 메시지를 반환한다.

## GET `/projects/{projectId}`

선택한 프로젝트의 상세정보를 반환한다.

### Path Parameters

| Name | Required | Description |
|------|----------|-------------|
| `projectId` | Yes | 프로젝트 식별자 |

### Success Response: `200 OK`

```json
{
  "project": {
    "id": "spec-driven-workbench",
    "name": "Spec Driven Workbench",
    "path": "/Users/yoophi/project/spec-driven-workbench",
    "gitOriginUrl": "git@github.com:yoophi/spec-driven-workbench.git"
  }
}
```

### Not Found Response: `404 Not Found`

```json
{
  "error": {
    "code": "PROJECT_NOT_FOUND",
    "message": "선택한 프로젝트를 찾을 수 없습니다."
  }
}
```

### Error Response: `500 Internal Server Error`

```json
{
  "error": {
    "code": "PROJECT_CATALOG_UNAVAILABLE",
    "message": "프로젝트 상세정보를 불러올 수 없습니다."
  }
}
```

### Contract Rules

- 존재하지 않는 `projectId`는 `404`로 응답한다.
- 상세 응답의 `project.id`는 요청한 `projectId`와 일치해야 한다.
- transport 오류와 catalog 오류는 프론트엔드가 retry action을 제공할 수 있는 형태로 응답한다.

## Existing Endpoint

`GET /health`는 기존 상태 확인 endpoint로 유지한다.
