# 좋아요(Like) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 목차

1. [좋아요 목록 조회](#1-좋아요-목록-조회)
2. [좋아요 단건 조회](#2-좋아요-단건-조회)
3. [좋아요 생성](#3-좋아요-생성)
4. [좋아요 삭제 (ID)](#4-좋아요-삭제-id)
5. [좋아요 삭제 (대상 기준)](#5-좋아요-삭제-대상-기준)

---

## 좋아요 모델 요약

| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 좋아요 ID (UUID) |
| createdAt | string | 생성일시 (ISO 8601) |
| likeType | enum | 좋아요 대상 타입 (`NEWS`, `COMMUNITY`, `ANNOUNCEMENT`, `COMMENT`) |
| targetId | string | 좋아요 대상 ID |
| user | object | 좋아요 누른 사용자 정보 (`User`) |

---

## 1. 좋아요 목록 조회

특정 대상(뉴스/커뮤니티/공고/댓글)의 좋아요 목록을 조회합니다.

### Endpoint

```
GET /like
```

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| likeType | enum | O | `NEWS`, `COMMUNITY`, `ANNOUNCEMENT`, `COMMENT` |
| targetId | string | O | 좋아요 대상 ID (UUID) |

### 인증

- 인증 불필요 (public API)

### Response (200)

```json
{
  "count": 2,
  "items": [
    {
      "id": "uuid-like-1",
      "createdAt": "2026-03-21T10:00:00.000Z",
      "likeType": "COMMENT",
      "targetId": "uuid-comment-1",
      "user": { "userId": "uuid-user-1" }
    }
  ]
}
```

### 에러

| 상태 | 설명 |
|------|------|
| 404 | 좋아요 대상 엔티티를 찾을 수 없음 |

---

## 2. 좋아요 단건 조회

좋아요 ID로 단건 조회합니다.

### Endpoint

```
GET /like/:id
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 좋아요 ID (UUID) |

### 인증

- 인증 불필요 (public API)

### Response (200)

`Like` 엔티티 1건 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 404 | 좋아요를 찾을 수 없음 |

---

## 3. 좋아요 생성

좋아요를 생성합니다. 같은 유저가 같은 대상에 중복 좋아요를 누르면 실패합니다.

### Endpoint

```
POST /like
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
| likeType | enum | O | `NEWS`, `COMMUNITY`, `ANNOUNCEMENT`, `COMMENT` |
| targetId | string | O | 좋아요 대상 ID (UUID) |

### Response (201)

생성된 `Like` 엔티티 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 404 | 좋아요 대상 엔티티를 찾을 수 없음 |
| 409 | 이미 좋아요한 대상 |

---

## 4. 좋아요 삭제 (ID)

좋아요 ID로 삭제합니다. **본인이 누른 좋아요만** 삭제 가능합니다.

### Endpoint

```
DELETE /like/:id
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 좋아요 ID (UUID) |

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
| 403 | 삭제 권한 없음 (본인 좋아요 아님) |
| 404 | 좋아요를 찾을 수 없음 |

---

## 5. 좋아요 삭제 (대상 기준)

좋아요 타입/대상 기준으로 현재 로그인 유저의 좋아요를 취소합니다.

### Endpoint

```
DELETE /like?likeType={LIKE_TYPE}&targetId={UUID}
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| likeType | enum | O | `NEWS`, `COMMUNITY`, `ANNOUNCEMENT`, `COMMENT` |
| targetId | string | O | 좋아요 대상 ID (UUID) |

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
| 404 | 대상 엔티티 또는 내 좋아요를 찾을 수 없음 |
