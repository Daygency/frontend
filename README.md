# 내가 쓴 글 조회 API

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용
>  
> 아래 4개 API는 모두 로그인 사용자 기준이며 `Authorization: Bearer {accessToken}` 이 필요합니다.

---

## 1) 내가 쓴 작성글 목록 API

### Endpoint

`GET /users/posts/my`

### 설명

- 내가 작성한 `커뮤니티`, `공연소식(news)`, `모집공고(announcement)`를 한 번에 조회합니다.
- 타입별로 분리된 배열 형태로 반환합니다.

### Response (200) 예시

```json
{
  "community": [
    {
      "communityId": "uuid-community-1",
      "title": "커뮤니티 글 제목",
      "category": "자유게시판",
      "createdAt": "2026-03-21T10:00:00.000Z"
    }
  ],
  "news": [
    {
      "newsId": "uuid-news-1",
      "title": "공연소식 제목",
      "place": "예술의전당",
      "createdAt": "2026-03-20T09:00:00.000Z"
    }
  ],
  "announcements": [
    {
      "postId": "uuid-announcement-1",
      "title": "모집공고 제목",
      "category": "행사",
      "scheduledAt": "2026-04-01T00:00:00.000Z",
      "deadlineAt": "2026-03-28T00:00:00.000Z"
    }
  ]
}
```

---

## 2) 내가 쓴 공연소식(news) 목록 API

### Endpoint

`GET /users/posts/my/news`

### 설명

- 내가 작성한 공연소식만 최신순(`createdAt DESC`)으로 조회합니다.

### Response (200) 예시

```json
[
  {
    "newsId": "uuid-news-2",
    "title": "두번째 공연소식",
    "place": "롯데콘서트홀",
    "createdAt": "2026-03-21T12:00:00.000Z"
  },
  {
    "newsId": "uuid-news-1",
    "title": "첫번째 공연소식",
    "place": "예술의전당",
    "createdAt": "2026-03-20T09:00:00.000Z"
  }
]
```

---

## 3) 내가 쓴 모집공고 목록 API

### Endpoint

`GET /users/posts/my/announcements`

### 설명

- 내가 작성한 모집공고만 조회합니다.
- 현재 엔티티에 생성일 컬럼이 없어 최신순 기준은 `postId DESC`를 사용합니다.

### Response (200) 예시

```json
[
  {
    "postId": "uuid-announcement-2",
    "title": "두번째 공고",
    "category": "오디션(연주자모집)",
    "scheduledAt": "2026-04-10T00:00:00.000Z",
    "deadlineAt": "2026-04-03T00:00:00.000Z",
    "status": "OPEN"
  }
]
```

---

## 4) 내가 쓴 최신 글 묶음 조회 API

### Endpoint

`GET /users/posts/my/highlights`

### 설명

- 한 번의 요청으로 아래를 동시에 조회합니다.
  - 최신 커뮤니티 글 1개
  - 최신 공연소식 5개
  - 최신 모집공고 1개
- 최신 모집공고 기준은 `postId DESC`를 사용합니다.

### Response (200) 예시

```json
{
  "latestCommunity": {
    "communityId": "uuid-community-9",
    "title": "가장 최근 커뮤니티 글",
    "category": "질문게시판",
    "createdAt": "2026-03-21T13:00:00.000Z"
  },
  "recentNews": [
    {
      "newsId": "uuid-news-9",
      "title": "가장 최근 공연소식",
      "place": "세종문화회관",
      "createdAt": "2026-03-21T12:30:00.000Z"
    }
  ],
  "latestAnnouncement": {
    "postId": "uuid-announcement-9",
    "title": "가장 최근 모집공고",
    "category": "행사",
    "scheduledAt": "2026-04-20T00:00:00.000Z",
    "deadlineAt": "2026-04-10T00:00:00.000Z"
  }
}
```

---

## 공통 에러

- `401 Unauthorized`: 인증 토큰이 없거나 유효하지 않음
 