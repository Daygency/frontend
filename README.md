# Backend API

## 내가 스크랩한 모집공고 조회 (무한스크롤)

내가 스크랩한 모집공고만 커서 기반으로 조회합니다.

- Method: `GET`
- Path: `/users/posts/my/scraps/announcements`
- Auth: `Authorization: Bearer {accessToken}`

### Query Parameters

| name | type | required | default | description |
| --- | --- | --- | --- | --- |
| cursor | string | X | - | 마지막으로 조회한 항목의 `scrappedAt` (ISO 8601) |
| limit | number | X | 20 | 한 번에 가져올 개수 (1~50) |

### Response (200)

```json
{
  "items": [
    {
      "scrapId": "0f78de53-d4b4-4e73-a46e-8b1d676e219f",
      "scrappedAt": "2026-03-21T10:00:00.000Z",
      "postId": "550e8400-e29b-41d4-a716-446655440000",
      "title": "2026 상반기 오케스트라 단원 모집",
      "type": "오디션",
      "isRecruiting": true,
      "dDay": "D-12"
    }
  ],
  "nextCursor": "2026-03-21T10:00:00.000Z",
  "hasMore": true
}
```

### 무한스크롤 호출 예시

1. 첫 페이지

```http
GET /users/posts/my/scraps/announcements?limit=20
Authorization: Bearer {accessToken}
```

2. 다음 페이지 (`nextCursor` 사용)

```http
GET /users/posts/my/scraps/announcements?limit=20&cursor=2026-03-21T10:00:00.000Z
Authorization: Bearer {accessToken}
```

### 정렬 기준

- 최신 스크랩 순 (`scrappedAt DESC`)
