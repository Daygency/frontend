# 댓글(Comment) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 목차

1. [댓글 목록 조회](#1-댓글-목록-조회)
2. [댓글 단건 조회](#2-댓글-단건-조회)
3. [댓글 작성](#3-댓글-작성)
4. [댓글 수정](#4-댓글-수정)
5. [댓글 삭제](#5-댓글-삭제)

---

## 댓글 모델 요약

| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 댓글 ID (UUID) |
| content | string | 댓글 내용 |
| createdAt | string | 생성일시 (ISO 8601) |
| deletedAt | string \| null | 삭제일시 (soft delete) |
| targetType | enum | 댓글 대상 타입 (`NEWS`, `COMMUNITY`) |
| targetId | string | 댓글 대상 ID |
| parentId | string \| null | 부모 댓글 ID (대댓글) |
| user | object | 작성자 정보 (`User`) |

---

## 1. 댓글 목록 조회

특정 게시글(뉴스/커뮤니티)에 달린 댓글 목록을 조회합니다.

### Endpoint

```
GET /comment
```

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| targetType | enum | O | `NEWS` 또는 `COMMUNITY` |
| targetId | string | O | 댓글 대상 게시글 ID (UUID) |

### 인증

- 인증 불필요 (public API)

### Response (200)

`Comment[]` 배열 반환 (작성일시 오름차순).

### 에러

| 상태 | 설명 |
|------|------|
| 404 | 댓글 대상 게시글을 찾을 수 없음 |

---

## 2. 댓글 단건 조회

댓글 ID로 단건 조회합니다.

### Endpoint

```
GET /comment/:id
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 댓글 ID (UUID) |

### 인증

- 인증 불필요 (public API)

### Response (200)

`Comment` 엔티티 1건 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 404 | 댓글을 찾을 수 없음 |

---

## 3. 댓글 작성

댓글 또는 대댓글을 작성합니다.

### Endpoint

```
POST /comment
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### 인증

- **필수**
- `AuthGuard('access')` 사용

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| content | string | O | 댓글 내용 |
| targetType | enum | O | `NEWS` 또는 `COMMUNITY` |
| targetId | string | O | 댓글 대상 게시글 ID (UUID) |
| parentId | string | X | 부모 댓글 ID (대댓글 작성 시) |

### Response (201)

생성된 `Comment` 엔티티 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 부모 댓글과 다른 게시글에 대댓글 작성 시 |
| 404 | 댓글 대상 게시글/부모 댓글을 찾을 수 없음 |

---

## 4. 댓글 수정

댓글 내용을 수정합니다. **작성자 본인만** 수정 가능합니다.

### Endpoint

```
PATCH /comment/:id
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 댓글 ID (UUID) |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| content | string | X | 수정할 댓글 내용 |

### Response (200)

수정된 `Comment` 엔티티 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 수정 권한 없음 (작성자 아님) |
| 404 | 댓글을 찾을 수 없음 |

---

## 5. 댓글 삭제

댓글을 삭제합니다. **작성자 본인만** 삭제 가능합니다.

### Endpoint

```
DELETE /comment/:id
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 댓글 ID (UUID) |

### Response (200)

```json
{
  "success": true
}
```

### 에러

| 상태 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 403 | 삭제 권한 없음 (작성자 아님) |
| 404 | 댓글을 찾을 수 없음 |
