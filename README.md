# 스크랩(Scrap) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 목차

1. [스크랩 목록 조회](#1-스크랩-목록-조회)
2. [스크랩 단건 조회](#2-스크랩-단건-조회)
3. [스크랩 생성](#3-스크랩-생성)
4. [스크랩 삭제 (ID)](#4-스크랩-삭제-id)
5. [스크랩 삭제 (대상 기준)](#5-스크랩-삭제-대상-기준)

---

## 스크랩 모델 요약

| 필드 | 타입 | 설명 |
|------|------|------|
| id | string | 스크랩 ID (UUID) |
| createdAt | string | 생성일시 (ISO 8601) |
| targetType | enum | 스크랩 대상 타입 (`NEWS`, `COMMUNITY`, `ANNOUNCEMENT`) |
| targetId | string | 스크랩 대상 ID |
| user | object | 스크랩한 사용자 정보 (`User`) |

---

## 1. 스크랩 목록 조회

특정 대상(뉴스/커뮤니티/공고)의 스크랩 목록을 조회합니다.

### Endpoint

```
GET /scrap
```

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| targetType | enum | O | `NEWS`, `COMMUNITY`, `ANNOUNCEMENT` |
| targetId | string | O | 스크랩 대상 ID (UUID) |

### 인증

- 인증 불필요 (public API)

### Response (200)

```json
{
  "count": 2,
  "items": [
    {
      "id": "uuid-scrap-1",
      "createdAt": "2026-03-21T10:00:00.000Z",
      "targetType": "COMMUNITY",
      "targetId": "uuid-community-1",
      "user": { "userId": "uuid-user-1" }
    }
  ]
}
```

### 에러

| 상태 | 설명 |
|------|------|
| 404 | 스크랩 대상 엔티티를 찾을 수 없음 |

---

## 2. 스크랩 단건 조회

스크랩 ID로 단건 조회합니다.

### Endpoint

```
GET /scrap/:id
```

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 스크랩 ID (UUID) |

### 인증

- 인증 불필요 (public API)

### Response (200)

`Scrap` 엔티티 1건 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 404 | 스크랩을 찾을 수 없음 |

---

## 3. 스크랩 생성

스크랩을 생성합니다. 같은 유저가 같은 대상에 중복 스크랩하면 실패합니다.

### Endpoint

```
POST /scrap
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
| targetType | enum | O | `NEWS`, `COMMUNITY`, `ANNOUNCEMENT` |
| targetId | string | O | 스크랩 대상 ID (UUID) |

### Response (201)

생성된 `Scrap` 엔티티 반환.

### 에러

| 상태 | 설명 |
|------|------|
| 401 | 인증 필요 |
| 404 | 스크랩 대상 엔티티를 찾을 수 없음 |
| 409 | 이미 스크랩한 대상 |

---

## 4. 스크랩 삭제 (ID)

스크랩 ID로 삭제합니다. **본인이 스크랩한 항목만** 삭제 가능합니다.

### Endpoint

```
DELETE /scrap/:id
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### Path Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| id | string | O | 스크랩 ID (UUID) |

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
| 403 | 삭제 권한 없음 (본인 스크랩 아님) |
| 404 | 스크랩을 찾을 수 없음 |

---

## 5. 스크랩 삭제 (대상 기준)

대상 타입/대상 ID 기준으로 현재 로그인 유저의 스크랩을 취소합니다.

### Endpoint

```
DELETE /scrap?targetType={TARGET_TYPE}&targetId={UUID}
```

### Headers

| 헤더 | 설명 |
|------|------|
| Authorization | Bearer {accessToken} |

### Query Parameters

| 파라미터 | 타입 | 필수 | 설명 |
|----------|------|------|------|
| targetType | enum | O | `NEWS`, `COMMUNITY`, `ANNOUNCEMENT` |
| targetId | string | O | 스크랩 대상 ID (UUID) |

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
| 404 | 대상 엔티티 또는 내 스크랩을 찾을 수 없음 |
