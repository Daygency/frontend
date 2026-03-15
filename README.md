## 커뮤니티(Community) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 목차

1. [커뮤니티 목록 조회](#1-커뮤니티-목록-조회)
2. [커뮤니티 상세 조회](#2-커뮤니티-상세-조회)
3. [커뮤니티 작성](#3-커뮤니티-작성)
4. [커뮤니티 수정](#4-커뮤니티-수정)
5. [커뮤니티 삭제](#5-커뮤니티-삭제)

---

## 1. 커뮤니티 목록 조회

커뮤니티 게시글 전체 목록을 조회합니다. 생성일 최신순으로 정렬됩니다.

### Endpoint

```
GET /community
```

### 인증

- 인증 불필요 (public API)

### Response

`Community` 엔티티 배열이 반환됩니다.

각 항목 예시 스키마:

| 필드        | 타입    | 설명                     |
|------------|---------|--------------------------|
| communityId| string  | 커뮤니티 ID (UUID)       |
| title      | string  | 제목                     |
| content    | string  | 내용                     |
| createdAt  | string  | 생성일시 (ISO 8601)     |
| user       | object  | 작성자 정보 (`User`)     |
| category   | object  | 커뮤니티 카테고리 정보   |
| file       | object  | 첨부 파일 정보 (선택적)  |

---

## 2. 커뮤니티 상세 조회

단일 커뮤니티 게시글 상세 정보를 조회합니다.

### Endpoint

```
GET /community/:id
```

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명                    |
|---------|--------|------|-------------------------|
| id      | string | O    | 커뮤니티 ID (communityId) |

### 인증

- 인증 불필요 (public API)

### Response

`Community` 엔티티 한 건이 그대로 반환됩니다.

| 필드        | 타입    | 설명                     |
|------------|---------|--------------------------|
| communityId| string  | 커뮤니티 ID (UUID)       |
| title      | string  | 제목                     |
| content    | string  | 내용                     |
| createdAt  | string  | 생성일시 (ISO 8601)     |
| user       | object  | 작성자 정보 (`User`)     |
| category   | object  | 커뮤니티 카테고리 정보   |
| file       | object  | 첨부 파일 정보 (선택적)  |

존재하지 않는 ID인 경우:

- `404 Not Found` + `"존재하지 않는 커뮤니티 게시글입니다."`

---

## 3. 커뮤니티 작성

새 커뮤니티 게시글을 작성합니다.

### Endpoint

```
POST /community
```

### Headers

| 헤더          | 설명                    |
|--------------|-------------------------|
| Authorization| Bearer {accessToken}    |

### 인증

- **필수**
- `AuthGuard('access')` 사용

### Request Body

`CreateCommunityDto` 기준:

| 필드      | 타입    | 필수 | 설명                             |
|----------|---------|------|----------------------------------|
| title    | string  | O    | 제목 (최대 100자)                |
| content  | string  | O    | 내용 (최대 255자)                |
| categoryId | string| O    | 커뮤니티 카테고리 ID (`CommunityCategory.categoryId`) |
| fileId   | string  | X    | 첨부 파일 ID (없으면 null/생략)  |

### Response (201)

저장된 `Community` 엔티티 전체가 반환됩니다.

예시:

```json
{
  "communityId": "b6b8d8e0-2f3c-4a8b-9c1d-1234567890ab",
  "title": "첫 번째 커뮤니티 글",
  "content": "내용입니다.",
  "createdAt": "2025-04-01T12:00:00.000Z",
  "user": { /* 작성자 정보 */ },
  "category": { /* 카테고리 정보 */ },
  "file": null
}
```

### 에러

| 상태 | 설명                                 |
|------|--------------------------------------|
| 401  | 인증 필요                            |
| 404  | 존재하지 않는 커뮤니티 카테고리      |

---

## 4. 커뮤니티 수정

커뮤니티 게시글을 수정합니다. **작성자 본인만** 수정할 수 있습니다.

### Endpoint

```
PATCH /community/:id
```

### Headers

| 헤더          | 설명                    |
|--------------|-------------------------|
| Authorization| Bearer {accessToken}    |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명          |
|---------|--------|------|---------------|
| id      | string | O    | 커뮤니티 ID   |

### 인증 / 권한

- **인증 필수**
- 로그인 유저가 해당 게시글의 작성자가 아닐 경우 `403 Forbidden`

### Request Body

`UpdateCommunityDto` 기준, 모든 필드는 선택입니다.

| 필드      | 타입    | 필수 | 설명                             |
|----------|---------|------|----------------------------------|
| title    | string  | X    | 제목                             |
| content  | string  | X    | 내용                             |
| categoryId | string| X    | 커뮤니티 카테고리 ID             |
| fileId   | string  | X    | 첨부 파일 ID                     |

### Response (200)

수정된 `Community` 엔티티 전체가 반환됩니다.

### 에러

| 상태 | 설명                                 |
|------|--------------------------------------|
| 401  | 인증 필요                            |
| 403  | 수정 권한 없음 (작성자 아님)         |
| 404  | 커뮤니티를 찾을 수 없음              |

---

## 5. 커뮤니티 삭제

커뮤니티 게시글을 삭제합니다. **작성자 본인만** 삭제할 수 있습니다.

### Endpoint

```
DELETE /community/:id
```

### Headers

| 헤더          | 설명                    |
|--------------|-------------------------|
| Authorization| Bearer {accessToken}    |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명          |
|---------|--------|------|---------------|
| id      | string | O    | 커뮤니티 ID   |

### 인증 / 권한

- **인증 필수**
- 로그인 유저가 해당 게시글의 작성자가 아닐 경우 `403 Forbidden`

### Response

성공 시:

```json
{
  "success": true
}
```

### 에러

| 상태 | 설명                                 |
|------|--------------------------------------|
| 401  | 인증 필요                            |
| 403  | 삭제 권한 없음 (작성자 아님)         |
| 404  | 커뮤니티를 찾을 수 없음              |

# 커뮤니티(Community) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 목차

1. [커뮤니티 카테고리 목록 조회](#1-커뮤니티-카테고리-목록-조회)
2. [커뮤니티 목록 조회](#2-커뮤니티-목록-조회)
3. [커뮤니티 상세 조회](#3-커뮤니티-상세-조회)
4. [커뮤니티 게시글 작성](#4-커뮤니티-게시글-작성)
5. [커뮤니티 게시글 수정](#5-커뮤니티-게시글-수정)
6. [커뮤니티 게시글 삭제](#6-커뮤니티-게시글-삭제)

---

## 커뮤니티 카테고리 (community_category)

게시판 카테고리 마스터 데이터. 애플리케이션 시작 시 자동 시드됩니다.

| 카테고리명         |
|-------------------|
| 자유게시판        |
| 구인              |
| 입시정보          |
| 학원운용          |
| 학원/연습실 매매  |

---

## 1. 커뮤니티 카테고리 목록 조회

커뮤니티 작성/필터 시 사용하는 카테고리 목록을 반환합니다.

### Endpoint

```
GET /community/categories
```

### Query Parameters

없음

### Response

| 필드       | 타입   | 설명                |
|-----------|--------|---------------------|
| categoryId | string | 카테고리 ID (UUID)  |
| name      | string | 카테고리명          |

### Example

**Request**

```
GET /community/categories
```

**Response**

```json
[
  { "categoryId": "uuid-1", "name": "자유게시판" },
  { "categoryId": "uuid-2", "name": "구인" },
  { "categoryId": "uuid-3", "name": "입시정보" },
  { "categoryId": "uuid-4", "name": "학원운용" },
  { "categoryId": "uuid-5", "name": "학원/연습실 매매" }
]
```

### 참고

- 인증 불필요 (public API)
- name 오름차순 정렬

---

## 2. 커뮤니티 목록 조회

무한스크롤 + 필터를 지원하는 커뮤니티 게시글 목록 조회 API입니다.

### Endpoint

```
GET /community
```

### Query Parameters

| 파라미터   | 타입   | 필수 | 설명                                           |
|-----------|--------|------|------------------------------------------------|
| cursor    | string | X    | 마지막으로 조회한 community_id (없으면 첫 페이지) |
| limit     | number | X    | 한 번에 가져올 개수 (기본 20, 최대 50)         |
| categoryId| string | X    | 카테고리 ID (필터)                              |

### Response

| 필드       | 타입             | 설명                    |
|-----------|------------------|-------------------------|
| items     | array            | 게시글 목록             |
| nextCursor| string \| null   | 다음 페이지 cursor (없으면 null) |
| hasMore   | boolean          | 다음 페이지 존재 여부    |

#### items 각 항목

| 필드        | 타입   | 설명              |
|------------|--------|-------------------|
| communityId| string | 게시글 ID         |
| title      | string | 제목              |
| category   | string | 카테고리명        |
| createdAt  | string | 작성일 (ISO 8601) |

### 참고

- 인증 불필요 (public API)
- 최신순 정렬

---

## 3. 커뮤니티 상세 조회

단일 커뮤니티 게시글 상세 정보를 조회합니다.

### Endpoint

```
GET /community/:id
```

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명       |
|---------|--------|------|------------|
| id      | string | O    | 게시글 ID (community_id) |

### Headers (선택)

| 헤더          | 설명                                           |
|--------------|------------------------------------------------|
| Authorization| Bearer {accessToken} — 있을 경우 `isMine` 정확히 반환 |

### Response

게시글 엔티티 정보 + `isMine` 필드

| 필드        | 타입    | 설명                                         |
|------------|---------|----------------------------------------------|
| communityId| string  | 게시글 ID                                    |
| title      | string  | 제목                                        |
| content    | string  | 내용                                        |
| createdAt  | string  | 작성일                                      |
| user       | object  | 작성자 정보                                 |
| category   | object  | 카테고리 정보                               |
| file       | object  | 대표 파일 정보 (썸네일)                     |
| isMine     | boolean | 내가 쓴 글인지 여부                         |

### 참고

- 인증 불필요 (public API). 로그인 없이도 조회 가능

---

## 4. 커뮤니티 게시글 작성

커뮤니티 게시글을 작성합니다.

### Endpoint

```
POST /community
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Request Body

| 필드       | 타입    | 필수 | 설명                  |
|-----------|---------|------|-----------------------|
| title     | string  | O    | 제목 (최대 100자)     |
| content   | string  | O    | 내용 (최대 255자)     |
| categoryId| string  | O    | 카테고리 ID           |
| fileId    | string  | O    | 대표 파일 ID (썸네일) |

### Example

**Request**

```json
{
  "title": "연주자 구인합니다",
  "content": "오케스트라 단원 모집합니다.",
  "categoryId": "550e8400-e29b-41d4-a716-446655440000",
  "fileId": "550e8400-e29b-41d4-a716-446655440001"
}
```

### 참고

- 인증 필요 (access token)

---

## 5. 커뮤니티 게시글 수정

커뮤니티 게시글 정보를 수정합니다. **작성자만** 수정 가능합니다.

### Endpoint

```
PATCH /community/:id
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명       |
|---------|--------|------|------------|
| id      | string | O    | 게시글 ID  |

### Request Body

CreateCommunityDto의 모든 필드 **선택(partial)**.

| 필드       | 타입   | 필수 | 설명        |
|-----------|--------|------|-------------|
| title     | string | X    | 제목        |
| content   | string | X    | 내용        |
| categoryId| string | X    | 카테고리 ID |
| fileId    | string | X    | 대표 파일 ID|

### 에러

| 상태 | 설명                |
|-----|---------------------|
| 401 | 인증 필요           |
| 403 | 수정 권한 없음 (작성자 아님) |
| 404 | 게시글을 찾을 수 없음  |

---

## 6. 커뮤니티 게시글 삭제

커뮤니티 게시글을 삭제합니다. 작성자 본인만 삭제 가능합니다.

### Endpoint

```
DELETE /community/:id
```

### Headers

| 헤더          | 설명           |
|--------------|----------------|
| Authorization| Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입   | 필수 | 설명       |
|---------|--------|------|------------|
| id      | string | O    | 게시글 ID  |

### Response

| 상태 | 설명                |
|-----|---------------------|
| 200 | 삭제 완료 (body 없음) |
| 401 | 인증 필요           |
| 403 | 삭제 권한 없음 (작성자 아님) |
| 404 | 게시글을 찾을 수 없음  |

### 참고

- 인증 필요 (access token)
- 작성자 본인만 삭제 가능
g