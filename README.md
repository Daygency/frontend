# Home API Spec (Frontend)

홈 화면 진입 시 필요한 데이터를 한 번에 조회하는 API입니다.

## Endpoint

- **Method**: `GET`
- **Path**: `/home`
- **Auth**: 불필요 (Public)

## Response (200)

```json
{
  "latestAnnouncements": [
    {
      "postId": "string",
      "title": "string",
      "type": "string",
      "isRecruiting": true,
      "dDay": "D-3"
    }
  ],
  "recentNews": [
    {
      "newsId": "string",
      "title": "string",
      "place": "string",
      "startedAt": "2026-03-24T10:00:00.000Z",
      "thumbnailUrl": "https://... or null"
    }
  ],
  "latestCommunityByCategory": [
    {
      "categoryId": "string",
      "categoryName": "string",
      "latestPost": {
        "communityId": "string",
        "title": "string",
        "likeCount": 0,
        "commentCount": 0,
        "viewCount": 0
      }
    }
  ]
}
```

## Field Rules

### `latestAnnouncements` (최대 3개)

- 최신 모집공고 순서로 반환됩니다.
- `isRecruiting`
  - `true`: 모집중 (`OPEN`)
  - `false`: 마감 (`CLOSED`)
- `dDay`
  - `D-n`: 마감까지 n일
  - `D-Day`: 오늘 마감
  - `마감`: 마감일 지남

### `recentNews` (최대 5개)

- 최신 공연소식 순서로 반환됩니다.
- `thumbnailUrl` 우선순위:
  1. 뉴스 첨부 이미지 중 정렬순(`sortOrder`)이 가장 앞선 이미지
  2. 뉴스 대표 이미지(`file_id`)
  3. 없으면 `null`

### `latestCommunityByCategory` (카테고리 개수만큼)

- 모든 커뮤니티 카테고리를 반환합니다.
- 각 카테고리별 `latestPost`는 최신 글 1개입니다.
- 카테고리에 글이 없으면 `latestPost: null` 입니다.
- `latestPost`에는 홈 카드 표시용 최소 필드만 포함됩니다:
  - `communityId`, `title`, `likeCount`, `commentCount`, `viewCount`

## Frontend Usage Notes

- 홈 진입 시 이 API 1회 호출을 기준으로 구성하세요.
- `latestCommunityByCategory[].latestPost`는 `null` 가능성을 반드시 처리하세요.
- `thumbnailUrl`이 `null`이면 프론트 기본 플레이스홀더 이미지를 사용하세요.
