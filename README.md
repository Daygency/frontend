# Backend API

## 내가 스크랩한 커뮤니티/공연소식 최신 묶음 조회

내가 가장 최근에 스크랩한 커뮤니티글 1개와 공연소식글 5개를 함께 조회합니다.

- Method: `GET`
- Path: `/users/posts/my/scraps/highlights`
- Auth: `Authorization: Bearer {accessToken}`

### Response (200)

```json
{
  "latestScrappedCommunity": {
    "scrapId": "a4f7a6a3-5a3d-4f3f-87ea-4a7f3083cbf3",
    "scrappedAt": "2026-03-21T11:00:00.000Z",
    "communityId": "7f9e4d21-c678-4f2f-8a12-4b7d93505f5b",
    "title": "합주실 정보 공유",
    "category": "자유",
    "createdAt": "2026-03-20T09:00:00.000Z",
    "likeCount": 12,
    "viewCount": 120,
    "commentCount": 5
  },
  "latestScrappedNews": [
    {
      "scrapId": "3f06dd40-0ee2-4ca3-8195-a237a42f7fda",
      "scrappedAt": "2026-03-21T10:30:00.000Z",
      "newsId": "9324b368-b0d8-4490-b1de-7aa353d04975",
      "title": "서울 재즈 페스티벌",
      "place": "서울",
      "createdAt": "2026-03-19T07:00:00.000Z",
      "likeCount": 31,
      "viewCount": 220,
      "commentCount": 14
    }
  ]
}
```

---

## 내가 스크랩한 커뮤니티글 목록 조회 (무한스크롤)

- Method: `GET`
- Path: `/users/posts/my/scraps/community`
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
      "scrapId": "a4f7a6a3-5a3d-4f3f-87ea-4a7f3083cbf3",
      "scrappedAt": "2026-03-21T11:00:00.000Z",
      "communityId": "7f9e4d21-c678-4f2f-8a12-4b7d93505f5b",
      "title": "합주실 정보 공유",
      "category": "자유",
      "createdAt": "2026-03-20T09:00:00.000Z",
      "likeCount": 12,
      "viewCount": 120,
      "commentCount": 5
    }
  ],
  "nextCursor": "2026-03-21T11:00:00.000Z",
  "hasMore": true
}
```

---

## 내가 스크랩한 공연소식글 목록 조회 (무한스크롤)

- Method: `GET`
- Path: `/users/posts/my/scraps/news`
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
      "scrapId": "3f06dd40-0ee2-4ca3-8195-a237a42f7fda",
      "scrappedAt": "2026-03-21T10:30:00.000Z",
      "newsId": "9324b368-b0d8-4490-b1de-7aa353d04975",
      "title": "서울 재즈 페스티벌",
      "place": "서울",
      "createdAt": "2026-03-19T07:00:00.000Z",
      "likeCount": 31,
      "viewCount": 220,
      "commentCount": 14
    }
  ],
  "nextCursor": "2026-03-21T10:30:00.000Z",
  "hasMore": true
}
```

---

## 내가 스크랩한 모집공고 조회 (무한스크롤)

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
