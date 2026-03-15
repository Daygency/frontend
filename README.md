# Daygency API 문서

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

---

## 문서 목록

| 문서 | 설명 |
|------|------|
| [auth-api.md](./auth-api.md) | **인증 API** – 소셜 로그인/회원가입, 토큰 사용법 |
| [announcement-api.md](./announcement-api.md) | **공고 API** – 공고 CRUD, 목록/상세/필터 |
| [api-readme.md](./api-readme.md) | **공통 API** – 활동아이디 중복확인, 공고 유형 목록 등 |

---

## 인증 (토큰) 요약

- **Access Token**: 1시간 | **Refresh Token**: 30일 (만료 시 `POST /auth/refresh`)
- **저장**: `AsyncStorage`(React Native) / `SecureStore` 권장
- **요청 헤더**: `Authorization: Bearer {accessToken}`

자세한 스펙은 [auth-api.md](./auth-api.md)를 참고하세요.


# 인증(Auth) API 명세

> Base URL: 개발 `http://localhost:3000`, 운영은 배포 URL 사용

모바일 앱에서 로그인·회원가입 시 사용하는 API입니다. **access token(1h) + refresh token(30d)** 구조로, 만료 시 refresh로 새 access token을 발급받아 앱처럼 장기간 로그인 상태가 유지됩니다.

---

## 목차

1. [토큰 개요](#1-토큰-개요)
2. [소셜 로그인](#2-소셜-로그인)
3. [소셜 회원가입](#3-소셜-회원가입)
4. [Access Token 갱신 (Refresh)](#4-access-token-갱신-refresh)
5. [인증 헤더 사용법](#5-인증-헤더-사용법)
6. [프론트 구현 가이드](#6-프론트-구현-가이드)

---

## 1. 토큰 개요

| 토큰 | 만료 | 용도 |
|------|------|------|
| **Access Token** | 1시간 | API 요청 시 `Authorization` 헤더에 포함 |
| **Refresh Token** | 30일 | access 만료 시 `POST /auth/refresh`로 새 access 발급 |

### 토큰 발급 시점

- 소셜 **로그인** 성공 시 → `accessToken`, `refreshToken`, `user` 반환
- 소셜 **회원가입** 완료 시 → 동일

### Access Token 만료 시 (1시간 후)

1. **먼저** `POST /auth/refresh` 호출 (refreshToken 전달)
2. 성공 → 새 accessToken 저장, 실패한 API 요청 재시도
3. refresh도 401이면 → refreshToken 만료, 재로그인 필요

### Refresh Token 만료 시 (30일 후)

- `POST /auth/refresh` 401 응답
- 소셜 로그인 API 다시 호출 필요

---

## 2. 소셜 로그인

카카오/구글/네이버에서 발급받은 **소셜 access token**으로 로그인합니다. 이미 Daygency 회원이면 토큰과 사용자 정보를 반환하고, 미가입이면 `needsSignup: true`로 회원가입 절차로 이동합니다.

### Endpoint

| Provider | Endpoint |
|----------|----------|
| 카카오 | `POST /auth/kakao` |
| 구글 | `POST /auth/google` |
| 네이버 | `POST /auth/naver` |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| accessToken | string | O | 소셜 로그인 앱에서 발급받은 access token |

### Response (로그인 성공)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": "ecfdc7fd-23be-4fa9-9cbd-e6f30d826349",
    "nickname": "조규연",
    "email": "user@example.com",
    "profileImgUrl": "https://..."
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| accessToken | string | JWT (1시간 유효). API 호출 시 사용 |
| refreshToken | string | JWT (30일 유효). access 만료 시 갱신용 |
| user.userId | string | Daygency 사용자 UUID |
| user.nickname | string | 닉네임 |
| user.email | string | 이메일 |
| user.profileImgUrl | string | 프로필 이미지 URL |

### Response (회원가입 필요)

```json
{
  "needsSignup": true,
  "profile": {
    "socialId": "1234567890",
    "nickname": "카카오닉네임",
    "email": "kakao@example.com",
    "profileImgUrl": "https://..."
  }
}
```

| 필드 | 타입 | 설명 |
|------|------|------|
| needsSignup | boolean | `true`이면 회원가입 화면으로 이동 |
| profile | object | 소셜 프로필 정보 (회원가입 API에 그대로 전달) |

### Example

**Request (카카오)**

```
POST /auth/kakao
Content-Type: application/json

{
  "accessToken": "카카오에서_발급받은_액세스토큰"
}
```

**Response (기존 회원)**

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "ecfdc7fd-23be-4fa9-9cbd-e6f30d826349",
    "nickname": "조규연",
    "email": "user@example.com",
    "profileImgUrl": "https://..."
  }
}
```

**Response (신규 → 회원가입 필요)**

```json
{
  "needsSignup": true,
  "profile": {
    "socialId": "1234567890",
    "nickname": "홍길동",
    "email": "hong@kakao.com",
    "profileImgUrl": "https://..."
  }
}
```

### 에러

| 상태 | 설명 |
|------|------|
| 401 | 소셜 access token 무효 또는 만료 |
| 400 | 요청 형식 오류 |

---

## 3. 소셜 회원가입

`needsSignup: true` 응답을 받은 후, **동일한 소셜 access token**과 `activityName`(활동 아이디)을 보내 회원가입을 완료합니다.

### Endpoint

| Provider | Endpoint |
|----------|----------|
| 카카오 | `POST /auth/signup/kakao` |
| 구글 | `POST /auth/signup/google` |
| 네이버 | `POST /auth/signup/naver` |

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| accessToken | string | O | 로그인 시 사용한 소셜 access token |
| activityName | string | O | 활동 아이디 (고유, 20자 이내) |
| nickname | string | X | 닉네임 (미입력 시 소셜 프로필 값 사용) |

### Response (회원가입 성공)

로그인과 동일한 형태로 `accessToken`, `refreshToken`, `user` 반환

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": "ecfdc7fd-23be-4fa9-9cbd-e6f30d826349",
    "nickname": "조규연",
    "email": "user@example.com",
    "profileImgUrl": "https://..."
  }
}
```

### Example

**Request**

```
POST /auth/signup/kakao
Content-Type: application/json

{
  "accessToken": "카카오에서_발급받은_액세스토큰",
  "activityName": "my_activity_id",
  "nickname": "조규연"
}
```

### 에러

| 상태 | 설명 |
|------|------|
| 400 | activityName 미입력 또는 형식 오류 |
| 401 | 소셜 access token 무효 |
| 409 | activityName 또는 nickname 이미 사용 중 |

### 사전 검증

회원가입 전 `activityName` 중복 검사 권장:

```
GET /users/check-activity-name?activityName=my_activity_id
```

→ `available: true`이면 사용 가능, `false`이면 이미 사용 중

---

## 4. Access Token 갱신 (Refresh)

Access token이 만료되면 (1시간 후) refresh token으로 **새 access token**을 발급받습니다. refresh token은 30일 유효합니다.

### Endpoint

```
POST /auth/refresh
```

### Request Body

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| refreshToken | string | O | 로그인/회원가입 시 발급받은 refresh token |

### Response (성공)

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "userId": "ecfdc7fd-23be-4fa9-9cbd-e6f30d826349",
    "nickname": "조규연",
    "email": "user@example.com",
    "profileImgUrl": "https://..."
  }
}
```

### 에러

| 상태 | 설명 |
|------|------|
| 401 | refresh token 만료 또는 무효 → 재로그인 필요 |

### 401 발생 시 프론트 처리

1. API 호출 → 401 응답
2. `POST /auth/refresh` 호출 (refreshToken 전달)
3. 200이면 → 새 accessToken 저장 후 실패한 요청 재시도
4. 401이면 → refreshToken도 만료, 토큰 삭제 후 로그인 화면 이동

---

## 5. 인증 헤더 사용법

인증이 필요한 API 호출 시 `Authorization` 헤더에 access token을 포함합니다.

### 형식

```
Authorization: Bearer {accessToken}
```

### 적용 대상 API 예시

- `GET /users/profile/my` — 내 프로필 조회
- `PATCH /users/profile/my` — 프로필 수정
- `POST /announcement` — 공고 작성
- `PATCH /announcement/:id` — 공고 수정
- `DELETE /announcement/:id` — 공고 삭제
- `GET /announcement/:id` — 공고 상세 (선택 인증, 토큰 있으면 `isMine` 정확히 반환)

### 예시 (React Native fetch)

```javascript
const token = await AsyncStorage.getItem('ACCESS_TOKEN_KEY');
const res = await fetch(`${API_BASE}/users/profile/my`, {
  headers: {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  },
});
```

### 401 응답 시

1. **먼저** `POST /auth/refresh` 호출 (refreshToken 전달)
2. 성공 → 새 accessToken 저장, 실패했던 API 재요청
3. refresh도 401 → 재로그인 필요 (토큰 삭제 후 로그인 화면)

---

## 5. 프론트 구현 가이드

### 권장 플로우

```
[앱 실행]
    ↓
AsyncStorage에 accessToken 있음?
    ├─ 있음 → 메인 화면 (토큰 포함 API 호출)
    └─ 없음 → 로그인 화면
              ↓
         소셜 로그인 (카카오/구글/네이버)
              ↓
         POST /auth/{provider}
              ↓
         needsSignup?
              ├─ true  → 회원가입 화면 → POST /auth/signup/{provider}
              └─ false → accessToken, refreshToken, user 저장 → 메인

[API 401 발생 시]
    1. POST /auth/refresh (refreshToken)
    2. 성공 → accessToken 갱신 저장, API 재시도
    3. 실패 → 로그인 화면
```

### 토큰 저장 권장 방식

| 환경 | 저장소 |
|------|--------|
| React Native | `AsyncStorage` 또는 `expo-secure-store` |
| 저장 키 | `ACCESS_TOKEN_KEY` 등 고정 문자열 사용 |

### 저장 예시

```javascript
// 로그인/회원가입 성공 시
await AsyncStorage.setItem('ACCESS_TOKEN_KEY', data.accessToken);
await AsyncStorage.setItem('REFRESH_TOKEN_KEY', data.refreshToken);
// user 정보도 필요 시 별도 저장 (userId, nickname 등)
```

### API 호출 헤더 유틸

```javascript
async function getAuthHeaders() {
  const token = await AsyncStorage.getItem('토큰키');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
```

### 401 처리 권장

1. API 호출 시 `res.status === 401` → 먼저 `POST /auth/refresh` 호출 (refreshToken 전달)
2. refresh 성공 → 새 accessToken 저장, 실패한 요청 재시도
3. refresh도 401 → refreshToken 만료. 토큰 삭제 후 로그인 화면으로 이동