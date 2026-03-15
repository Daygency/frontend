# 공연소식(News) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 목차

1. [공연소식 목록 조회](#1-공연소식-목록-조회)
2. [공연소식 상세 조회](#2-공연소식-상세-조회)
3. [공연소식 작성](#3-공연소식-작성)
4. [공연소식 수정](#4-공연소식-수정)
5. [공연소식 삭제](#5-공연소식-삭제)

---

## 1. 공연소식 목록 조회

무한스크롤을 지원하는 공연소식 목록 조회 API입니다. 최신순 정렬됩니다.

### Endpoint

```
GET /news
```

### Query Parameters

| 파라미터 | 타입   | 필수 | 설명                                           |
|---------|--------|------|------------------------------------------------|
| cursor  | string | X    | 마지막으로 조회한 news_id (없으면 첫 페이지)   |
| limit   | number | X    | 한 번에 가져올 개수 (기본 20, 최대 50)         |

### Response

| 필드       | 타입             | 설명                    |
|-----------|------------------|-------------------------|
| items     | array            | 공연소식 목록           |
| nextCursor| string \| null   | 다음 페이지 cursor (없으면 null) |
| hasMore   | boolean          | 다음 페이지 존재 여부    |

#### items 각 항목

| 필드    | 타입   | 설명        |
|---------|--------|-------------|
| newsId  | string | 공연소식 ID |
| title   | string | 제목        |
| place   | string | 장소        |
| startedAt | string | 공연 시작일시 (ISO 8601) |

### Example

**Request**

```
GET /news?limit=20
```

**Response**

```json
{
  "items": [
    {
      "newsId": "d45ba94f-3e2a-4e2d-a25b-7b39b0c27a5c",
      "title": "2025 봄 콘서트",
      "place": "예술의전당",
      "startedAt": "2025-04-01T19:00:00.000Z"
    }
  ],
  "nextCursor": "d45ba94f-3e2a-4e2d-a25b-7b39b0c27a5c",
  "hasMore": true
}
```

### 참고

- 인증 불필요 (public API)
- 최신순 정렬 (newsId DESC)

---

## 2. 공연소식 상세 조회

단일 공연소식 상세 정보를 조회합니다.

### Endpoint

```
GET /news/:id
```

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명         |
|---------|--------|------|--------------|
| id      | string | O    | 공연소식 ID (news_id) |

### Headers (선택)

| 헤더          | 설명                                           |
|--------------|------------------------------------------------|
| Authorization| Bearer {accessToken} — 있을 경우 `isMine` 정확히 반환 |

### Response

공연소식 엔티티 정보 + `isMine` 필드

| 필드       | 타입    | 설명                                         |
|-----------|---------|----------------------------------------------|
| newsId    | string  | 공연소식 ID                                  |
| title     | string  | 제목                                         |
| content   | string  | 내용                                         |
| place     | string  | 장소                                         |
| ticketPrice | number \| null | 티켓 가격 (null 가능)              |
| startedAt | string  | 공연 시작일시 (ISO 8601)                      |
| endedAt   | string \| null | 공연 종료일 (하루 공연이면 null)       |
| contact   | string  | 문의처                                       |
| createdAt | string  | 생성일                                       |
| user      | object  | 작성자 정보                                  |
| file      | object  | 대표 파일 정보 (썸네일)                       |
| isMine    | boolean | 내가 쓴 글인지 여부. 로그인 시에만 의미 있음   |

### 참고

- 인증 불필요 (public API). 로그인 없이도 조회 가능
- 로그인 후 `Authorization` 헤더를 보내면 `isMine`이 `true`/`false`로 정확히 반환됨

---

## 3. 공연소식 작성

공연소식을 작성합니다.

### Endpoint

```
POST /news
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Request Body

| 필드       | 타입    | 필수 | 설명                              |
|-----------|---------|------|-----------------------------------|
| title     | string  | O    | 제목 (최대 100자)                 |
| content   | string  | O    | 내용 (최대 255자)                 |
| place     | string  | O    | 장소 (최대 100자)                 |
| ticketPrice | number | X    | 티켓 가격 (null 가능)             |
| startedAt | string  | O    | 공연 시작일시 (ISO 8601)          |
| endedAt   | string  | X    | 공연 종료일 (하루 공연이면 null)  |
| contact   | string  | O    | 문의처 (최대 30자)                |
| fileId    | string  | O    | 대표 파일 ID (썸네일)             |

### Example

**Request**

```json
{
  "title": "2025 봄 콘서트",
  "content": "올해 봄 시즌 오케스트라 공연",
  "place": "예술의전당",
  "ticketPrice": 30000,
  "startedAt": "2025-04-01T19:00:00.000Z",
  "endedAt": "2025-04-01T21:00:00.000Z",
  "contact": "02-1234-5678",
  "fileId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response (201)**

```json
{
  "newsId": "d45ba94f-3e2a-4e2d-a25b-7b39b0c27a5c",
  "title": "2025 봄 콘서트",
  "place": "예술의전당",
  "startedAt": "2025-04-01T19:00:00.000Z"
}
```

### 참고

- 인증 필요 (access token)
- fileId는 필수 (대표 이미지/썸네일)

---

## 4. 공연소식 수정

공연소식 정보를 수정합니다. **작성자만** 수정 가능합니다.

### Endpoint

```
PATCH /news/:id
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명         |
|---------|--------|------|--------------|
| id      | string | O    | 공연소식 ID  |

### Request Body

CreateNewsDto의 모든 필드 **선택(partial)**. 수정할 필드만 보내면 됩니다.

| 필드       | 타입    | 필수 | 설명                              |
|-----------|---------|------|-----------------------------------|
| title     | string  | X    | 제목                              |
| content   | string  | X    | 내용                              |
| place     | string  | X    | 장소                              |
| ticketPrice | number | X    | 티켓 가격 (null 가능)             |
| startedAt | string  | X    | 공연 시작일시 (ISO 8601)          |
| endedAt   | string  | X    | 공연 종료일 (null 가능)           |
| contact   | string  | X    | 문의처                            |
| fileId    | string  | X    | 대표 파일 ID                      |

### Response (200)

```json
{
  "newsId": "d45ba94f-3e2a-4e2d-a25b-7b39b0c27a5c",
  "title": "2025 봄 콘서트 (수정)",
  "place": "예술의전당",
  "startedAt": "2025-04-01T19:00:00.000Z"
}
```

### 에러

| 상태 | 설명                |
|-----|---------------------|
| 401 | 인증 필요           |
| 403 | 수정 권한 없음 (작성자 아님) |
| 404 | 공연소식을 찾을 수 없음  |

---

## 5. 공연소식 삭제

공연소식을 삭제합니다. 작성자 본인만 삭제 가능합니다.

### Endpoint

```
DELETE /news/:id
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명         |
|---------|--------|------|--------------|
| id      | string | O    | 공연소식 ID  |

### Response

| 상태 | 설명                |
|-----|---------------------|
| 200 | 삭제 완료 (body 없음) |
| 401 | 인증 필요           |
| 403 | 삭제 권한 없음 (작성자 아님) |
| 404 | 공연소식을 찾을 수 없음  |

### 참고

- 인증 필요 (access token)
- 작성자 본인만 삭제 가능
