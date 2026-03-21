# 모집공고 스크랩 API

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

모집공고를 스크랩(저장)하는 API입니다.  
동일한 유저가 동일한 모집공고를 중복 스크랩하면 `409` 에러가 발생합니다.

---

## 모집공고 스크랩 생성

### Endpoint

`POST /scrap`

### Headers

- `Authorization: Bearer {accessToken}`

### 인증

- 필수 (`AuthGuard('access')`)

### Request Body

```json
{
  "targetType": "ANNOUNCEMENT",
  "targetId": "모집공고 postId(UUID)"
}
```

### Response (201) 예시

```json
{
  "id": "uuid-scrap-1",
  "createdAt": "2026-03-21T10:00:00.000Z",
  "targetType": "ANNOUNCEMENT",
  "targetId": "uuid-announcement-1",
  "user": {
    "userId": "uuid-user-1"
  }
}
```

### 에러

- `401 Unauthorized`: 인증 토큰이 없거나 유효하지 않음
- `404 Not Found`: 대상 모집공고를 찾을 수 없음
- `409 Conflict`: 이미 스크랩한 모집공고
